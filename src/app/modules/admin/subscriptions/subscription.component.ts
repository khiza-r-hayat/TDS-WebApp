import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FirebaseService } from 'app/shared/core/classes/firebase_utils';
import { UserRole } from 'app/shared/core/classes/roles';
import { Utility } from 'app/shared/core/classes/utility';
import { UserApprovalModel } from 'app/shared/core/domain/models/shipment.model';
import { SubscriptionService } from 'app/shared/core/domain/services/subscription.service';

@Component({
    selector: 'subscription',
    standalone: true,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        TextFieldModule,
    ],
    templateUrl: './subscription.component.html',
})
export class SubscriptionsComponent {
     file1: File = null;
     file2: File = null;
    //<--------------------- Flag Variables ---------------------->
    isSaving = signal<boolean>(false);
    isActiveUser = signal<boolean>(false);
    showMcNoField = signal<boolean>(false);
    hasSubscription = signal<boolean>(false);
    //<--------------------- Data Variables ---------------------->
    form: UntypedFormGroup;
    userId = null;

    // minDate = Date();
    // maxDate = Date();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _subscriptionService: SubscriptionService,
        private _userService: UserService,
        private _snackbar: MatSnackBar,
        private _firebaseService: FirebaseService
        // private logger: LogService
    ) {}

    roles = computed(() =>
        this._subscriptionService
            .roles()
            .filter((r) => r.id !== UserRole.SUPER_ADMINISTRATOR)
    );

    userApprovalRequest = computed(() =>
        this._subscriptionService.userApprovalRequests()
    );

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        // this.tenantId = this._sessionService.session().tenantId;
        this._userService.user$.subscribe((user: User) => {
            this.userId = user.id;
        });

        this.initializeForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Data Setup Methods
    // -----------------------------------------------------------------------------------------------------

    initializeForm() {
        this.form = this._formBuilder.group({
            orgName: ['', [Validators.required]],
            roleId: ['', [Validators.required]],
            mcNo: [''],
            file1: [null, Validators.required], // Example: Required file
            file2: [null, Validators.required],
        });
        if (this.userApprovalRequest() && this.userApprovalRequest().length) {
            this.patchForm(this.userApprovalRequest()[0]);
        }
    }

    patchForm(rqst: UserApprovalModel) {
        this.form.patchValue({
            orgName: rqst.orgName,
            roleId: rqst.roleId,
            mcNo: rqst.mcNo ?? '',
        });
        this.isSaving.set(true);
        this.form.disable();
    }

    roleChange(roleId) {
        const control = this.form.get('mcNo');
        switch (roleId) {
            case UserRole.OPERATOR_ADMIN:
                {
                    control.addValidators([Validators.required]);
                    this.showMcNoField.set(true);
                }
                break;
            case UserRole.SHIPMENT_ADMIN:
                {
                    control.removeValidators([Validators.required]);
                    this.showMcNoField.set(false);
                }
                break;
        }
        control.updateValueAndValidity();
    }
    

    // -----------------------------------------------------------------------------------------------------
    // @ Form Modification Methods
    // -----------------------------------------------------------------------------------------------------

    onFileSelected(event: Event, controlName: string): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if(controlName==='file1'){
                this.file1 = file;
            }else{
                this.file2 = file;
            }
            this.form.get(controlName)?.setValue(file);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Upload/Save Methods
    // -----------------------------------------------------------------------------------------------------

    async save(){
        try {
            let formData = this.form.getRawValue();

            const file1Url = await this._firebaseService.uploadFile(
                this.file1,
                `approval_documents/${formData.file1.name}`
            );
            const file2Url = await this._firebaseService.uploadFile(
                formData.file2,
                `approval_documents/${formData.file2.name}`
            );

            const upload: UserApprovalModel = {
                id: Utility.generateUUID(),
                userId: this.userId,
                orgName: formData.orgName,
                roleId: formData.roleId,
                approved: false,
                mcNo: formData.mcNo,
                w9FileUrl: file1Url,
                insuranceFileUrl: file2Url,
            };

            // console.log('form value:', upload);

            this._subscriptionService
                .upsertApprovalRequest([upload])
                .subscribe((res) => {
                    this.isSaving.set(true);
                    this._snackbar.open('Request Sent for approval!', 'Close', {
                        duration: 3000,
                    });

                    this.form.disable();
                });
        } catch (e) {
            console.log(e);
            this._snackbar.open('Something went wrong!', 'Close', {
                duration: 3000,
            });
        }
    }
}
