import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, OnInit, signal } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utility } from 'app/shared/core/classes/utility';
import {
    LocalLocation,
    pakistan_locations,
} from 'app/shared/core/data/data_sets/cities_and_state';
import {
    BrandModel,
    BrandUpload,
} from 'app/shared/core/domain/models/brand.model';
import { BrandService } from 'app/shared/core/domain/services/brand.service';
import { UserSessionService } from 'app/shared/core/domain/services/session.service';
import { BrandListComponent } from '../list/list.component';

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
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class BrandDetailComponent implements OnInit {
    //<--------------------- Flag Variables ---------------------->

    isSaving = signal<boolean>(false);
    editMode: boolean = false;
    //<--------------------- Data Variables ---------------------->
    brandId: string = null;
    brandForm: UntypedFormGroup;
    tenantId = null;

    brand = this._brandService.brand;
    locations = pakistan_locations;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _brandListComponent: BrandListComponent,
        private _brandService: BrandService,
        private _sessionService: UserSessionService
        // private logger: LogService
    ) {}

    originLocations = signal<LocalLocation[]>(pakistan_locations);
    destinationLocations = signal<LocalLocation[]>(pakistan_locations);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        // this.tenantId = this._sessionService.session().tenantId;

        if (!this._router.url.includes('add')) {
            this.editMode = true;
            this.brandId = this._activatedRoute.snapshot.paramMap.get('id');
        } else {
            this.brandId = Utility.generateUUID();
        }

        this._brandListComponent.matDrawer.open();
        this.initializeForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Data Setup Methods
    // -----------------------------------------------------------------------------------------------------

    initializeForm() {
        this.brandForm = this._formBuilder.group({
            origin: ['0', [Validators.required]],
            destination: ['0', [Validators.required]],
            pickupEarliest: ['0', [Validators.required]],
            pickupLatest: ['0', [Validators.required]],
            // status: ["0", [Validators.required]],
        });
        if (this.editMode) {
            this.patchForm(this.brand());
        }
    }

    patchForm(brand: BrandModel) {
        this.brandForm.patchValue({
            name: brand.name,
            status: brand.status ? '0' : '1',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Drawer Methods
    // -----------------------------------------------------------------------------------------------------

    closeDrawer(): Promise<MatDrawerToggleResult> {
        this._router.navigateByUrl('/loads');
        return this._brandListComponent.matDrawer.close();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Upload/Save Methods
    // -----------------------------------------------------------------------------------------------------

    save() {
        let formData = this.brandForm.getRawValue();

        const upload: BrandUpload = {
            id: this.brandId,
            name: formData.name,
            tenantId: this.tenantId,
            status: formData === '0',
        };

        this._brandService
            .upsertBrands([upload])
            .subscribe((res) => this.closeDrawer());
    }
}
