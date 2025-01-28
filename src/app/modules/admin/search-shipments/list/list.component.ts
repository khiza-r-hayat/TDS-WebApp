import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    ViewChild,
    computed,
    signal,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { TranslocoModule } from '@ngneat/transloco';
import { ConfirmationDialogs } from 'app/shared/core/classes/confirmation_dialogs';
import {
    equipmentTypes,
    pakistan_locations,
} from 'app/shared/core/data/data_sets/cities_and_state';
import {
    GeoLocationModel,
    ShipmentFilterModel,
    ShipmentModel,
} from 'app/shared/core/domain/models/shipment.model';
import { ShipmentService } from 'app/shared/core/domain/services/shipment.service';
import { ShipmentAgePipe } from 'app/shared/pipes/shipment-age/shipment-age.pipe';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatMenuModule,
        MatFormField,
        MatTableModule,
        MatSortModule,
        MatIcon,
        MatInput,
        MatButton,
        MatPaginator,
        RouterLink,
        DatePipe,
        TranslocoModule,
        FuseFindByKeyPipe,
        ShipmentAgePipe,
        MatFormFieldModule,
        MatDatepickerModule,
        MatFormField,
        FormsModule,
        ReactiveFormsModule,
        DecimalPipe,
    ],
    templateUrl: './list.component.html',
})
export class SearchShipmentListComponent implements OnInit, AfterViewInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('shipmentDetailsView') shipmentDetailsView: TemplateRef<any>;
    // dataSourceBulkImport: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('selectAll') selectAllCheckBox: MatCheckbox;

    @ViewChild('originInput') originInput!: ElementRef;
    @ViewChild('destinationInput') destinationInput!: ElementRef;
    originAutocomplete: google.maps.places.Autocomplete | undefined;
    destinationAutocomplete: google.maps.places.Autocomplete | undefined;

    geoOrigin: GeoLocationModel | undefined;
    geoDestination: GeoLocationModel | undefined;

    //<--------------------- Table Variables ---------------------->
    dataSource: MatTableDataSource<any>;

    drawerMode: 'side' | 'over';
    itemsPerPage = 20;
    tableColumns: string[] = [
        'age',
        'rate',
        'pickUp',
        'trip',
        'ref',
        'equipment',
        // 'bids',
        'status',
        'actions',
    ];

    selection = new SelectionModel<any>(true, []);

    locations = pakistan_locations;
    equipmentTypes = equipmentTypes;

    filterForm: UntypedFormGroup;

    //<--------------------- Model Variables ---------------------->
    shipmentInView = signal<ShipmentModel>(null);
    bidRate: number = 0;
    //<--------------------- Flag Variables ---------------------->

    enableActions = signal<boolean>(false);
    searchRoute = signal<boolean>(false);
    searchText = signal<string>('');

    constructor(
        private _shipmentService: ShipmentService,
        private _confirmationDialogs: ConfirmationDialogs,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog
    ) {}

    shipments = computed(() => {
        const data = this._shipmentService.filterShipments(this.searchText());
        if (this.dataSource) {
            this.dataSource.data = data;
        }
        return data ?? [];
    });

    initializeForm() {
        this.filterForm = this._formBuilder.group({
            origin: ['', [Validators.required]],
            destination: ['', [Validators.required]],
            odh: ['', [Validators.required]],
            ddh: ['', [Validators.required]],
            start: ['', [Validators.required]],
            end: ['', [Validators.required]],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Drawer Methods
    // -----------------------------------------------------------------------------------------------------

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });
        this.matDrawer.close();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    viewShipmentDetails(shipment: ShipmentModel) {
        this.shipmentInView.set(shipment);
        this._dialog
            .open(this.shipmentDetailsView, {
                width: '50vw',
            })
            .afterClosed()
            .subscribe(() => {
                this.shipmentInView.set(null);
            });
    }
    closeAll() {
        this._dialog.closeAll();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        // this._activatedRoute.data.subscribe((data) => {
        //     // console.log(data);
        //     this.searchRoute.set(data['search']);
        // });
        this.initializeForm();

        this.dataSource = new MatTableDataSource(this.shipments());
    }

    // ngOnDestroy(): void {
    //   // Unsubscribe from all subscriptions
    //   this._unsubscribeAll.next(null);
    //   this._unsubscribeAll.complete();
    // }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        setTimeout(() => {
            if (window.google?.maps?.places) {
                this.initOriginAutocomplete();
                this.initDestinationAutocomplete();
            } else {
                console.error('Google Maps library not loaded');
            }
        }, 2000);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Location Methods
    // -----------------------------------------------------------------------------------------------------

    private initOriginAutocomplete(): void {
        if (!this.originInput?.nativeElement) return;

        this.originAutocomplete = new google.maps.places.Autocomplete(
            this.originInput.nativeElement,
            {
                types: ['geocode'],
                fields: ['place_id', 'geometry', 'formatted_address', 'name'],
            }
        );

        this.originAutocomplete.addListener('place_changed', () => {
            const place = this.originAutocomplete?.getPlace();
            if (place?.geometry) {
                const location = place.geometry.location;
                const lat = location?.lat();
                const lng = location?.lng();
                const address = place.formatted_address;

                this.filterForm.patchValue({
                    origin: address,
                });

                // false boolean for destination object
                this.assignLocation(lat, lng, false);
            }
        });
    }

    private initDestinationAutocomplete(): void {
        if (!this.destinationInput?.nativeElement) return;

        this.destinationAutocomplete = new google.maps.places.Autocomplete(
            this.destinationInput.nativeElement,
            {
                types: ['geocode'],
                fields: ['place_id', 'geometry', 'formatted_address', 'name'],
            }
        );

        this.destinationAutocomplete.addListener('place_changed', () => {
            const place = this.destinationAutocomplete?.getPlace();
            if (place?.geometry) {
                const location = place.geometry.location;
                const lat = location?.lat();
                const lng = location?.lng();
                const address = place.formatted_address;

                this.filterForm.patchValue({
                    destination: address,
                });

                // true boolean for destination object
                this.assignLocation(lat, lng, true);
            }
        });
    }

    assignLocation(lat: number, lng: number, isDestination: boolean) {
        const locationData: GeoLocationModel = {
            type: 'Point',
            coordinates: [lng, lat],
        };
        if (isDestination) {
            this.geoDestination = locationData;
        } else {
            this.geoOrigin = locationData;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Filter Methods
    // -----------------------------------------------------------------------------------------------------

    filterBySearch(text: string) {
        this.searchText.update(() => text);
    }

    applyFilter() {
        const form = this.filterForm.getRawValue();
        const filter: ShipmentFilterModel = {
            origin: this.geoOrigin,
            destination: this.geoDestination,
            odh: form.odh * 1000,
            ddh: form.ddh * 1000,
            start: form.start,
            end: form.end,
        };

        this._shipmentService.getFilteredShipments(filter).subscribe((data) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Save/Upload Methods
    // -----------------------------------------------------------------------------------------------------

    submitBid() {}

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
