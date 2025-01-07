import { TextFieldModule } from "@angular/cdk/text-field";
import { Component, OnInit, signal } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
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
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Utility } from "app/shared/core/classes/utility";
import { TenantListComponent } from "../list/list.component";
import { TenantService } from "app/shared/core/domain/services/tenant.service";
import { Tenant } from "app/shared/core/domain/models/tenant.model";
import { TenantMapper } from "app/shared/core/data/api/tenant/tenant.mapper";
import { LogService } from "app/shared/logs/log.service";
import { TenantHelper } from "app/shared/core/domain/helpers/tenant.helper";
import { UserSessionService } from "app/shared/core/domain/services/session.service";

@Component({
  selector: "app-detail",
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
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class TenantDetailComponent implements OnInit {
  //<--------------------- Flag Variables ---------------------->

  isSaving = signal<boolean>(false);
  editMode: boolean = false;
  //<--------------------- Data Variables ---------------------->
  tenantId: string = null;
  tenantForm: UntypedFormGroup;
  plans = [];
  userId = null;

  tenant = this._tenantService.tenant;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _tenantListComponent: TenantListComponent,
    private _tenantService: TenantService,
    private _sessionService: UserSessionService,
    // private logger: LogService
  ) {}
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.plans = this._tenantService.plans();
    this.userId = this._sessionService.session().userId;

    if (!this._router.url.includes("add")) {
      this.editMode = true;
      this.tenantId = this._activatedRoute.snapshot.paramMap.get("id");
    } else {
      this.tenantId = Utility.generateUUID();
    }

    this._tenantListComponent.matDrawer.open();
    this.initializeForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Data Setup Methods
  // -----------------------------------------------------------------------------------------------------

  initializeForm() {
    this.tenantForm = this._formBuilder.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
        Utility.noWhitespaceValidator(),
      ],
      subscription: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      subsType: ["perEvent", [Validators.required]],
      status: ["0", [Validators.required]],
    });
    if (this.editMode) {
      this.patchForm(this.tenant());
    }
  }

  patchForm(tenant: Tenant) {
    const sub = TenantHelper.getTenantSubScription(tenant.subscriptions);

    this.tenantForm.patchValue({
      title: tenant.title,
      subscription: sub.plan.id,
      startDate: sub.startDate,
      endDate: sub.endDate,
      subsType: sub.type,
      status: sub.isActive ? "0" : "1",
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Drawer Methods
  // -----------------------------------------------------------------------------------------------------

  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._router.navigateByUrl("/tenants");
    return this._tenantListComponent.matDrawer.close();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Upload/Save Methods
  // -----------------------------------------------------------------------------------------------------

  save() {
    const mapper = new TenantMapper();
    let form = this.tenantForm.getRawValue();
    form.startDate = Utility.formatDate(form.startDate);
    form.endDate = Utility.formatDate(form.endDate);
    const data = mapper.mapTo(
      TenantHelper.generateTenantUpload(form, this.userId, this.tenantId)
    );
    this._tenantService
      .upsertTenants([data])
      .subscribe((res) => this.closeDrawer());
  }
}
