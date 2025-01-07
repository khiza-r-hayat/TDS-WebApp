import { Component, OnInit, signal } from "@angular/core";
import { SponsorListComponent } from "../list/list.component";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { TextFieldModule } from "@angular/cdk/text-field";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterLink } from "@angular/router";
import { Utility } from "app/shared/core/classes/utility";
import { SponsorUpload } from "app/shared/core/domain/models/sponsor.model";
import { LogService } from "app/shared/logs/log.service";
import { SponsorService } from "app/shared/core/domain/services/sponsor.service";
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
    TextFieldModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class SponsorDetailComponent implements OnInit {
  //<--------------------- Flag Variables ---------------------->
  isSaving = signal<boolean>(false);
  // editMode: boolean = false;

  //<--------------------- Data Variables ---------------------->
  sponsorForm: UntypedFormGroup;

  constructor(
    private _sponsorListComponent: SponsorListComponent,
    private _sponsorService: SponsorService,
    private _sessionService: UserSessionService,
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    // private logger: LogService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this._sponsorListComponent.matDrawer.open();

    this.sponsorForm = this._formBuilder.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
        Utility.noWhitespaceValidator(),
      ],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Drawer Methods
  // -----------------------------------------------------------------------------------------------------

  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._router.navigateByUrl("/sponsors");
    return this._sponsorListComponent.matDrawer.close();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Upload/Save Methods
  // -----------------------------------------------------------------------------------------------------

  save() {
    const session = this._sessionService.session();
    const formData = this.sponsorForm.getRawValue();
    const upload: SponsorUpload = {
      id: Utility.generateUUID(),
      title: formData.title,
      tenantId: session.tenantId,
      createdBy: session.userId,
    };

    this._sponsorService
      .upsertSponsors(
        [upload],
        session.user.tenantRoles.find((t) => t.tenantId === session.tenantId)
          .tenant
      )
      .subscribe((res) => this.closeDrawer());
  }
}
