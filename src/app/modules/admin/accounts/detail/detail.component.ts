import { TextFieldModule } from "@angular/cdk/text-field";
import {
  Component,
  computed,
  ElementRef,
  signal,
  ViewChild,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { UserRole } from "app/shared/core/classes/roles";
import { CONSTANTS, Utility } from "app/shared/core/classes/utility";
import { AccountHelper } from "app/shared/core/domain/helpers/account.helper";
import {
  AccountModel,
  Roles,
  UserModel,
} from "app/shared/core/domain/models/account.model";
import { Sponsor } from "app/shared/core/domain/models/sponsor.model";
import { AccountService } from "app/shared/core/domain/services/account.service";
import { UserSessionService } from "app/shared/core/domain/services/session.service";
import { SponsorService } from "app/shared/core/domain/services/sponsor.service";
import { TenantService } from "app/shared/core/domain/services/tenant.service";
import { LogService } from "app/shared/logs/log.service";
import { Subject } from "rxjs";
import { AccountListComponent } from "../list/list.component";

@Component({
  selector: "app-detail",
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
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    TextFieldModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class AccountDetailComponent {
  @ViewChild("avatarFileInput") private _avatarFileInput: ElementRef;

  //<-------------------------- flags --------------------------->

  resetPassword = signal<boolean>(false);
  editMode: boolean = false;
  isSaving = signal<boolean>(false);
  disableCompanyInput = signal<boolean>(false);

  //<-------------------------- Ids --------------------------->
  accountId: string = null;

  //<-------------------------- form --------------------------->
  accountForm: UntypedFormGroup;

  //<-------------------------- Data --------------------------->

  filteredRoles = signal<Roles[]>([]);
  filteredCompanies = signal<{ id: string; title: string }[]>([]);

  //   private _tagsPanelOverlayRef: OverlayRef;
  // private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _accountListComponent: AccountListComponent,
    private _accountService: AccountService,
    private _sessionService: UserSessionService,
    private _tenantService: TenantService,
    private _sponsorService: SponsorService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private logger: LogService
  ) {
    // effect(() => this.updateControl("password", this.resetPassword()));
  }

  account = this._accountService.account;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // check route and open account form in drawer
    if (!this._router.url.includes("add")) {
      this.editMode = true;
    } else {
      this.resetPassword.set(true);
    }
    this._accountListComponent.matDrawer.open();

    // initalize the account form
    this.setRoleList();
    this.initializeForm();
  }

  // ngOnDestroy(): void {
  //   this._unsubscribeAll.next(null);
  //   this._unsubscribeAll.complete();
  // }

  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._router.navigateByUrl("/accounts");
    return this._accountListComponent.matDrawer.close();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Data setup Methods
  // -----------------------------------------------------------------------------------------------------

  initializeForm() {
    this.accountForm = this._formBuilder.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
        ],
      ],
      // gender: "",
      role: ["", [Validators.required]],
      company: ["", [Validators.required]],
      email: [
        "",
        [Validators.pattern(CONSTANTS.emailPattern), Validators.required],
      ],
      password: ["", Validators.pattern(CONSTANTS.passwordPattern)],
    });
    this.roleChange(
      this.editMode
        ? this._accountService.account().role
        : this._sessionService.session().user.role
    );
    if (this.editMode) {
      this.patchAccountForm(this._accountService.account());
    }
  }

  patchAccountForm(account: UserModel) {
    this.accountId = account === null ? null : account.id;
    this.accountForm.patchValue({
      title: account.title,
      role: account.role,
      email: account.email,
      phone: account.phone,
    });
  }

  patchCompany(account: AccountModel) {
    let company;
    if (account.companyRoles && account.companyRoles.length) {
      company = account.companyRoles[0].sponsorCompany;
    } else if (account.tenantRoles && account.tenantRoles.length) {
      company = account.tenantRoles[0].tenant;
    }
    return company;
  }

  generatePassWord() {
    this.accountForm.patchValue({
      password: Utility.generateStrongPassword(),
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Role Based Methods
  // -----------------------------------------------------------------------------------------------------

  setRoleList() {
    // let user = this._sessionService.session().user;
    // let roles = this._accountService.roles();
    // switch (user.roleId) {
    //   case UserRole.SUPER_ADMINISTRATOR:
    //   case UserRole.EVENT_ORGANIZER:
    //     {
    //       this.filteredRoles.set(
    //         roles.filter((r) =>
    //           AccountHelper.roleHasAccess(r.id, [
    //             UserRole.SPONSOR,
    //             UserRole.EVENT_ORGANIZER,
    //           ])
    //         )
    //       );
    //     }
    //     break;
    //   case UserRole.SPONSOR:
    //     {
    //       this.filteredRoles.set(
    //         roles.filter((r) =>
    //           AccountHelper.roleHasAccess(r.id, [
    //             UserRole.SPONSOR,
    //             UserRole.SUPERVISOR,
    //             UserRole.BOOTH_PERSONNEL,
    //           ])
    //         )
    //       );
    //     }
    //     break;
    // }
  }

  setSponsorList(user: AccountModel) {
    this._sponsorService
      .getSponsorsByTenantId(user.tenantRoles[0].tenantId)
      .subscribe((res: Sponsor[]) => {
        let sponsors = this._sponsorService
          .sponsors()
          .map((s) => Object.assign({}, { id: s.id, title: s.title }));
        this.filteredCompanies.set(sponsors);
      });
  }

  setTenantList() {
    this._tenantService.getTenants().subscribe((res) => {
      let tenants = this._tenantService
        .tenants()
        .map((t) => Object.assign({}, { id: t.id, title: t.title }));
      this.filteredCompanies.set(tenants);
    });
  }

  roleChange(value) {
    // let user = this._sessionService.session().user;
    // this.accountForm.patchValue({ company: {} });
    // if (user.roleId === UserRole.SUPER_ADMINISTRATOR) {
    //   if (value.id === UserRole.SPONSOR) {
    //     this.setSponsorList(user);
    //   } else if (value.id === UserRole.EVENT_ORGANIZER) {
    //     this.setTenantList();
    //   }
    // } else if (user.roleId === UserRole.EVENT_ORGANIZER) {
    //   if (value.id == UserRole.SPONSOR) {
    //     this.disableCompanyInput.set(false);
    //     this.setSponsorList(user);
    //   } else {
    //     this.disableCompanyInput.set(true);
    //     this.accountForm.patchValue({ company: this.patchCompany(user) });
    //   }
    // } else if (user.roleId === UserRole.SPONSOR) {
    //   this.disableCompanyInput.set(true);
    //   this.accountForm.patchValue({ company: this.patchCompany(user) });
    // }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Data Transform methods
  // -----------------------------------------------------------------------------------------------------

  displayRole(role: Roles): string {
    return role && role.name ? role.name : "";
  }

  displayCompany(company: any): string {
    return company && company.title ? company.title : "";
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Upload/Save methods
  // -----------------------------------------------------------------------------------------------------

  save(): void {
    this.isSaving.set(true);

    // Get the contact object
    const accountData = AccountHelper.getUploadableAccount(
      this.accountForm.getRawValue(),
      this.editMode,
      this._sessionService.session().user.id,
      this._accountService.account(),
      ""
    );

    this._accountService.updateAccounts([accountData]).subscribe((res) => {
      if (res) {
        this.isSaving.set(false);
        this.closeDrawer();
      }
    });
  }

  uploadAvatar(fileList: FileList): void {
    // Return if canceled
    if (!fileList.length) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    const file = fileList[0];

    // Return if the file is not allowed
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    // Upload the avatar
    // this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
  }

  removeAvatar(): void {
    // Get the form control for 'avatar'
    // const avatarFormControl = this.contactForm.get("avatar");

    // Set the avatar as null
    // avatarFormControl.setValue(null);

    // Set the file input value as null
    this._avatarFileInput.nativeElement.value = null;

    // Update the contact
    // this.contact.avatar = null;
  }
}
