import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    TemplateRef,
    ViewChild,
    computed,
    signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
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
import { CONSTANTS } from 'app/shared/core/classes/utility';
import {
    equipmentTypes,
    pakistan_locations,
} from 'app/shared/core/data/data_sets/cities_and_state';
import {
    BidModel,
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
        MatCheckbox,
        MatPaginator,
        RouterLink,
        DatePipe,
        TranslocoModule,
        FuseFindByKeyPipe,
        ShipmentAgePipe,
        CurrencyPipe,
        DatePipe,
    ],
    templateUrl: './list.component.html',
})
export class ShipmentListComponent {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    // dataSourceBulkImport: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('selectAll') selectAllCheckBox: MatCheckbox;

    @ViewChild('shipmentBidsView') shipmentBidsView: TemplateRef<any>;

    //<--------------------- Table Variables ---------------------->
    dataSource: MatTableDataSource<any>;

    drawerMode: 'side' | 'over';
    itemsPerPage = 20;
    tableColumns: string[] = [
        'select',
        'action',
        'age',
        'rate',
        'pickUp',
        'trip',
        'ref',
        'equipment',
        'status',
        'bids',
    ];

    selection = new SelectionModel<any>(true, []);

    locations = pakistan_locations;
    equipmentTypes = equipmentTypes;
    shipmentBids = signal<BidModel[]>([]);
    shipmentInView = signal<ShipmentModel>(null);

    //<--------------------- Flag Variables ---------------------->

    enableActions = signal<boolean>(false);
    // searchRoute = signal<boolean>(false);
    searchText = signal<string>('');

    constructor(
        private _shipmentService: ShipmentService,
        private _confirmationDialogs: ConfirmationDialogs,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog
    ) {}

    shipments = computed(() => {
        const data = this._shipmentService.filterShipments(this.searchText());
        if (this.dataSource) {
            this.dataSource.data = data;
        }
        return data ?? [];
    });

    // -----------------------------------------------------------------------------------------------------
    // @ Drawer Methods
    // -----------------------------------------------------------------------------------------------------

    // onBackdropClicked(): void {
    //     // Go back to the list
    //     this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    //     this.matDrawer.close();

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.shipments());
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // ngOnDestroy(): void {
    //   // Unsubscribe from all subscriptions
    //   this._unsubscribeAll.next(null);
    //   this._unsubscribeAll.complete();
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Selection Methods
    // -----------------------------------------------------------------------------------------------------

    toggleActions() {
        this.enableActions.update((s) => !s);
    }

    masterToggle(event) {
        if (this.selection.selected.some((e) => e)) {
            this.clearSelection();
        } else {
            if (event.checked) {
                this.selectAll();
            } else {
                event.checked = false;
            }
        }
    }

    selectRow(event) {
        event.stopPropagation();
        if (!this.selection.selected.filter((e) => e).length) {
            this.selectAllCheckBox.indeterminate = false;
            this.toggleActions();
        } else {
            this.selectAllCheckBox.indeterminate = true;
            this.enableActions.set(true);
        }
    }

    selectAll() {
        this.selectAllCheckBox.checked = true;
        this.shipments()
            .filter((s) => s.open)
            .forEach((row) => this.selection.select(row));
        if (this.selection.selected.length) {
            this.toggleActions();
        }
    }

    clearSelection() {
        this.selectAllCheckBox.checked = false;
        this.toggleActions();
        this.selection.clear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Dialog Methods
    // -----------------------------------------------------------------------------------------------------
    openBidsDialog(shipment: ShipmentModel) {
        this.shipmentBids.set(shipment.bids ?? []);
        this._dialog.open(this.shipmentBidsView, {
            height: '70vh',
            width: '70vw',
        });
    }

    closeAll() {
        this._dialog.closeAll();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Filter Methods
    // -----------------------------------------------------------------------------------------------------

    filterBySearch(text: string) {
        this.searchText.update(() => text);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Save Methods
    // -----------------------------------------------------------------------------------------------------
    acceptBid(bid: BidModel) {
        this._confirmationDialogs
            .confirmApproval('Bid', false, 'Accept')
            .afterClosed()
            .subscribe((res) => {
                if (res === CONSTANTS.CONFIRMED) {
                    const bidUpload: BidModel = {
                        ...bid,
                        accepted: true,
                    };

                    this._shipmentService
                        .upsertShipmentStatus(bidUpload)
                        .subscribe((res) => {
                            if (res) {
                                this.shipmentInView.update((value) => {
                                    const index = value.bids.findIndex(
                                        (b) => b.operatorId === bid.operatorId
                                    );

                                    value.bids[index] = {
                                        ...bidUpload,
                                    };
                                    return value;
                                });
                                this._dialog.closeAll();
                            }
                        });
                }
            });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Delete Methods
    // -----------------------------------------------------------------------------------------------------

    remove(shipment?: ShipmentModel) {
        const multi: boolean = shipment === null || shipment === undefined;
        this._confirmationDialogs
            .confirmDelete('Shipment', multi)
            .afterClosed()
            .subscribe((result) => {
                if (result === CONSTANTS.CONFIRMED) {
                    this._shipmentService.removeSelectedShipments(
                        shipment ? [shipment] : this.selection.selected
                    );
                    this.clearSelection();
                }
            });
    }

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
