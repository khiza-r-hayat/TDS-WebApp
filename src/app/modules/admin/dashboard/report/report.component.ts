import { Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatRipple } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { FilterComponent } from "app/shared/components/filter-component/filter-component.component";
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: "app-report",
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    RouterLink,
    MatMenuModule,
    MatRipple,
    FilterComponent,
    NgApexchartsModule,
  ],
  templateUrl: "./report.component.html",
  styleUrl: "./report.component.scss",
})
export class ReportComponent {
  // user: AccountModel;
  // userRoles = UserRole;
  // selectedEvent: EventModel = { id: "", title: "" } as EventModel;
  // chartOptions = {};
  // filter = signal<FilterModel>(null);

  // constructor(
  //   private _sessionService: UserSessionService,
  //   private _eventService: EventService,
  //   private _campaignService: CampaignService
  // ) {
  //   this.user = this._sessionService.session().user;
  // }

  // events = computed(() => this._eventService.events());

  // eventStockTypes = signal<StockTypeModel[]>([]);

  // evenLocations = signal<CityModel[]>([]);

  // campaigns = computed(() => this._campaignService.campaigns());

  // ngOnInit() {
  //   this.selectedEvent = this.events()[0];
  //   this.switchReportEvent(this.selectedEvent);
  // }

  // switchReportEvent(event: EventModel) {
  //   this._eventService.getEventByIdForDashoboard(event.id).subscribe((res) => {
  //     if (res) {
  //       this.selectedEvent = res[0];
  //       console.log("res: ", res);
  //       this.eventStockTypes.set(
  //         this.selectedEvent.evnetStockTypes.map((s) => s.stockType)
  //       );
  //       this.evenLocations.set(
  //         this.selectedEvent.eventSponsorStocks?.flatMap((s) => s.area.city) ??
  //           []
  //       );
  //       if (!this.filter()) {
  //         this.initFilter();
  //       }
  //       this.renderChart(this.filter());
  //     }
  //   });
  // }

  // initFilter() {
  //   const today = new Date();
  //   const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  //   const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
  //   this.filter.set({
  //     startDate: Utility.formatDate(firstDay),
  //     endDate: Utility.formatDate(lastDay),
  //     selections: this.evenLocations()
  //       .slice(0, 1)
  //       .map((c) => c.id),
  //     stockType: this.eventStockTypes().find((s) =>
  //       s.name.toLowerCase().includes("sog")
  //     )?.id,
  //   });
  // }

  // renderChart(filter: FilterModel) {
  //   this.filter.set(filter);
  //   const stockType = this.eventStockTypes().find(
  //     (s) => s.id === filter.stockType
  //   );
  //   const usedStockKey = ReportsHelper.getKeyForUsedStock(stockType);
  //   const reportsCalculations = ReportsHelper.calculateActivationDashoboard(
  //     this.selectedEvent,
  //     filter,
  //     stockType
  //   );
  //   const stockDetailsData =
  //     reportsCalculations["stockDetailCalculationByCity"];

  //   const bacisCalculation = reportsCalculations["basicCalculationByCity"];
  //   this.chartOptions["achievment"] = ChartsHelper.renderDailyAchievementChart(
  //     bacisCalculation,
  //     stockType,
  //     usedStockKey,
  //     this.evenLocations()
  //   );
  //   this.chartOptions["mtd"] = ChartsHelper.renderMTDAchievementChart(
  //     bacisCalculation,
  //     stockType,
  //     usedStockKey,
  //     this.evenLocations()
  //   );
  //   this.chartOptions["detail"] = ChartsHelper.renderStockDetailChart(
  //     stockDetailsData,
  //     stockType,
  //     usedStockKey,
  //     true
  //   );
  //   this.chartOptions["duration"] = ChartsHelper.renderTotalDurationChart(
  //     bacisCalculation,
  //     stockType,
  //     usedStockKey,
  //     this.evenLocations()
  //   );
  // }
}
