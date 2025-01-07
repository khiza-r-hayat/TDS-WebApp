import { Component, OnInit } from "@angular/core";
import { ChartsHelper } from "app/shared/core/domain/helpers/charts.helper";
import { ReportsHelper } from "app/shared/core/domain/helpers/reports.helper";
import { FilterModel } from "app/shared/core/domain/models/common.model";
import { StockTypeModel } from "app/shared/core/domain/models/event.model";
import { EventService } from "app/shared/core/domain/services/event.service";
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: "app-stock-report",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./stock-report.component.html",
  styleUrl: "./stock-report.component.scss",
})
export class StockReportComponent implements OnInit {
  chartOptions = {};
  constructor(private _eventService: EventService) {}

  event = this._eventService.event;

  eventStockTypes = this.event().evnetStockTypes.map((s) => s.stockType);

  eventLocations = this.event().eventSponsorStocks.flatMap((s) => s.area.city);

  ngOnInit(): void {
    console.log(this.event());
    this.initializeReport();
  }

  initializeReport(filter?: FilterModel) {
    const data = ReportsHelper.calculateStockInsight(this.event(), filter);

    const result = ReportsHelper.getTotalStockCalculation(data, false);

    this.renderChart(result);
  }

  renderStockTables() {
    //TODO: render tables
  }

  renderChart(result) {
    //generate chart for each stock type
    for (let stockType of this.eventStockTypes) {
      if (result[stockType.id]) {
        this.chartOptions[stockType.id] = this.getChartOptionsByStocktype(
          result,
          stockType
        );
      }
    }
  }

  getChartOptionsByStocktype(data, stockType: StockTypeModel) {
    const usedStockKey = ReportsHelper.getKeyForUsedStock(stockType);
    delete data[stockType.id]["name"];
    return ChartsHelper.renderStockDetailChart(
      data,
      stockType,
      usedStockKey,
      false
    );
  }
}
