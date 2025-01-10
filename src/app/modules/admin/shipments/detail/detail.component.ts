import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Utility } from 'app/shared/core/classes/utility';
import {
    EquipmentType,
    LocalLocation,
    equipmentTypes,
    pakistan_locations,
} from 'app/shared/core/data/data_sets/cities_and_state';
import { ShipmentHelper } from 'app/shared/core/domain/helpers/shipment.helper';
import {
    BrandModel,
    ShipmentModel,
} from 'app/shared/core/domain/models/brand.model';
import { BrandService } from 'app/shared/core/domain/services/brand.service';
import { ShipmentService } from 'app/shared/core/domain/services/shipment.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-detail',
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
        AsyncPipe,
    ],
    templateUrl: './detail.component.html',
})
export class ShipmentDetailComponent implements OnInit {
    //<--------------------- Flag Variables ---------------------->

    isSaving = signal<boolean>(false);
    editMode: boolean = false;
    //<--------------------- Data Variables ---------------------->
    shipmentId: string = null;
    form: UntypedFormGroup;
    userId = null;

    brand = this._brandService.brand;
    locations = pakistan_locations;

    // minDate = Date();
    // maxDate = Date();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        // private _brandListComponent: BrandListComponent,
        private _brandService: BrandService,
        private _shipmentService: ShipmentService,
        private _userService: UserService
        // private logger: LogService
    ) {}

    originLocations$!: Observable<LocalLocation[]>;
    destinationLocations$!: Observable<LocalLocation[]>;
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
        this.setUpAutoCompleteFilters();
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
            this.patchForm(this.brand());
        }
    }

    patchForm(brand: BrandModel) {
        this.form.patchValue({
            name: brand.name,
            status: brand.status ? '0' : '1',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Form Modification Methods
    // -----------------------------------------------------------------------------------------------------

    // formatAmount(event: any) {
    //     const input = event.target;
    //     let value = input.value.replace(/[^0-9]/g, '');

    //     // Store cursor position relative to the number
    //     const cursorPos = input.selectionStart - 4; // Adjust for "PKR "

    //     const formattedValue = `PKR ${Number(value).toLocaleString()} /Trip`;
    //     input.value = formattedValue;

    //     // Place cursor back in number section
    //     const numberEndIndex = formattedValue.indexOf(' /Trip');
    //     const newPos = Math.min(cursorPos + 4, numberEndIndex);
    //     input.setSelectionRange(newPos, newPos);
    // }

    setUpAutoCompleteFilters() {
        this.originLocations$ = this.form.get('origin').valueChanges.pipe(
            startWith(''),
            map((value) => {
                const key = typeof value === 'string' ? value : value?.title;
                return key
                    ? this._filterInput(key)
                    : pakistan_locations.slice();
            })
        );

        this.destinationLocations$ = this.form
            .get('destination')
            .valueChanges.pipe(
                startWith(''),
                map((value) => {
                    const key =
                        typeof value === 'string' ? value : value?.title;
                    return key
                        ? this._filterInput(key)
                        : pakistan_locations.slice();
                })
            );
    }

    private _filterInput(name: string): any[] {
        const filterValue = name.toLowerCase();
        return pakistan_locations.filter((role) =>
            role.name.toLowerCase().includes(filterValue)
        );
    }

    displayLocation(location: LocalLocation) {
        return location && location.name
            ? `${location.name} ,  ${location.country ?? ''}`
            : '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Upload/Save Methods
    // -----------------------------------------------------------------------------------------------------

    save() {
        let formData = this.form.getRawValue();

        // const upload: ShipmentModel = {
        //     id: this.shipmentId,
        //     userId: this._userService.user.id,
        //     originId: formData.origin.id,
        //     destinationId: formData.destination.id,
        //     pickupEarliest: formData.pickupEarliest,
        //     pickupLatest: formData.pickupLatest,
        //     pickupHours: formData.pickupHours,
        //     dropoffHours: formData.dropoffHours,
        //     equipmentId: formData.equipment.id,
        //     availableLength: formData.availableLength,
        //     weight: formData.weight,
        //     comments: formData.comments,
        //     commodity: formData.commodity,
        //     refId: formData.refId,
        //     contact: formData.contact,
        //     rate: formData.rate,
        // };
        const upload: ShipmentModel =
            ShipmentHelper.generateShipmentUploadObject(
                formData,
                this.shipmentId,
                this.userId
            );

        console.log('form value:', upload);

        this._shipmentService
            .upsertShipments([upload])
            .subscribe((res) => console.log('upload response:', res));
    }
}
