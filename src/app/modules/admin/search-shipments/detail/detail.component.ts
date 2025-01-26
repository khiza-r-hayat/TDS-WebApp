import { TextFieldModule } from '@angular/cdk/text-field';
import {
    AfterViewInit,
    Component,
    computed,
    ElementRef,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Utility } from 'app/shared/core/classes/utility';
import {
    EquipmentType,
    equipmentTypes,
    pakistan_locations,
} from 'app/shared/core/data/data_sets/cities_and_state';
import { ShipmentHelper } from 'app/shared/core/domain/helpers/shipment.helper';
import { GeoLocationModel, ShipmentModel } from 'app/shared/core/domain/models/shipment.model';
import { ShipmentService } from 'app/shared/core/domain/services/shipment.service';

@Component({
    selector: 'app-bid',
    standalone: true,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        TextFieldModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDivider,
    ],
    templateUrl: './detail.component.html',
})
export class ShipmentBidComponent implements OnInit, AfterViewInit {
    @ViewChild('originInput') originInput!: ElementRef;
    @ViewChild('destinationInput') destinationInput!: ElementRef;
    originAutocomplete: google.maps.places.Autocomplete | undefined;
    destinationAutocomplete: google.maps.places.Autocomplete | undefined;

    geoOrigin: GeoLocationModel | undefined;
    geoDestination: GeoLocationModel | undefined;
    //<--------------------- Flag Variables ---------------------->

    isSaving = signal<boolean>(false);
    editMode: boolean = false;
    //<--------------------- Data Variables ---------------------->
    shipmentId: string = null;
    form: UntypedFormGroup;
    userId = null;

    shipment = computed(() => this._shipmentService.shipment());
    locations = pakistan_locations;

    // minDate = Date();
    // maxDate = Date();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _shipmentService: ShipmentService,
        private _userService: UserService,
        private _snackbar: MatSnackBar
        // private logger: LogService
    ) {}
    equipmentTypes = signal<EquipmentType[]>(equipmentTypes);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        // this.tenantId = this._sessionService.session().tenantId;
        this._userService.user$.subscribe((user: User) => {
            this.userId = user.id;
        });

        if (!this._router.url.includes('add')) {
            this.editMode = true;
            this.shipmentId = this._activatedRoute.snapshot.paramMap.get('id');
        } else {
            this.shipmentId = Utility.generateUUID();
        }

        // this._brandListComponent.matDrawer.open();
        this.initializeForm();
        // this.setUpAutoCompleteFilters();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (window.google?.maps?.places) {
                this.initOriginAutocomplete();
                this.initDestinationAutocomplete();
            } else {
                console.error('Google Maps library not loaded');
            }
        }, 2000);
    }

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

                this.form.patchValue({
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

                this.form.patchValue({
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
    // @ Data Setup Methods
    // -----------------------------------------------------------------------------------------------------

    initializeForm() {
        this.form = this._formBuilder.group({
            origin: ['', [Validators.required]],
            destination: ['', [Validators.required]],
            pickupEarliest: ['', [Validators.required]],
            pickupLatest: '',
            pickupHours: '',
            dropoffHours: '',
            equipment: ['', [Validators.required]],
            availableLength: ['', [Validators.required]],
            weight: ['', [Validators.required]],
            comments: '',
            commodity: '',
            refId: '',
            contact: ['phone', [Validators.required]],
            rate: ['', [Validators.required]],
        });
        if (this.editMode) {
            this.patchForm(this.shipment());
        }
    }

    patchForm(shipment: ShipmentModel) {
        this.form.patchValue({
            id: shipment.id,
            userId: shipment.userId,
            origin: shipment.originAddress,
            destination: shipment.destinationAddress,
            pickupEarliest: shipment.pickupEarliest,
            pickupLatest: shipment.pickupLatest,
            pickupHours: shipment.pickupHours,
            dropoffHours: shipment.dropoffHours,
            equipment: shipment.equipmentId,
            availableLength: shipment.availableLength,
            weight: shipment.weight,
            comments: shipment.comments,
            commodity: shipment.commodity,
            refId: shipment.refId,
            contact: shipment.contact,
            rate: shipment.rate,
        });
        this.geoOrigin = shipment.origin;
        this.geoDestination = shipment.destination;
    }

    onSubmit(event: Event): void {
        event.preventDefault(); // Prevent form submission
        // You can handle other logic here if needed
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Form Modification Methods
    // -----------------------------------------------------------------------------------------------------

    // formatInput() {
    //     const rateControl = this.form.get('rate');
    //     rateControl.setValue(this._cuurencyPipe.transform(
    //         rateControl.value,
    //         'PKR',
    //         'symbol',
    //         '1.0-0'
    //     ));
    //   }

    goToProfile(): void {
        this._router.navigate(['/profile/', this.userId]);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Upload/Save Methods
    // -----------------------------------------------------------------------------------------------------

    save() {
        let formData = this.form.getRawValue();
        const upload: ShipmentModel =
            ShipmentHelper.generateShipmentUploadObject(
                formData,
                this.shipmentId,
                this.userId,
                this.geoOrigin,
                this.geoDestination
            );

        // console.log('form value:', upload);

        this._shipmentService.upsertShipments([upload]).subscribe((res) => {
            if (res) {
                setTimeout(() => {
                    this._router.navigate(['../']);
                }, 3000);
            }
            this._snackbar.open('Shipment Saved', 'Close', {
                duration: 3000,
            });
        });
    }
}
