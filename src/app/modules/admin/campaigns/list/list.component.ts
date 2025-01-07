import { DatePipe, NgClass, PercentPipe } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink, Router } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { LogService } from "app/shared/logs/log.service";
import { CampaignService } from "app/shared/core/domain/services/campaign.service";
import { CampaignStatusType } from "app/shared/core/classes/utility";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    CdkScrollable,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    NgClass,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    PercentPipe,
    ReactiveFormsModule,
    TranslocoModule,
    DatePipe,
  ],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
})
export class CampaignListComponent {
  availableStaus = [
    { id: 1, title: CampaignStatusType.ACTIVE_CAMPAIGNS },
    { id: 2, title: CampaignStatusType.ENDED_CAMPAIGNS },
    { id: 3, title: CampaignStatusType.UPCOMING_CAMPAIGNS },
  ];

  searchText = signal<string>("");
  status = signal<string>("");
  hideCompleted = signal<boolean>(false);

  constructor(
    private _campaignService: CampaignService,
    private _router: Router,
    // private logger: LogService
  ) {}

  campaigns = computed(() =>
    this._campaignService.applyFilters(
      this.searchText(),
      this.status(),
      this.hideCompleted()
    )
  );

  filterByStatus(event) {
    this.status.update(() => event.value);
  }

  filterByQuery(event) {
    this.status.update(() => event.value);
  }

  toggleCompleted(event: MatSlideToggleChange) {
    this.hideCompleted.update(() => event.checked);
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
