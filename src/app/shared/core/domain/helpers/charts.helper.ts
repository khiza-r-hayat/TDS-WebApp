import { Injectable } from "@angular/core";
import { BarChartSeries, ChartOptions } from "../models/common.model";
import { Utility } from "../../classes/utility";
import { CityModel, StockTypeModel } from "../models/event.model";
import { ReportsHelper } from "./reports.helper";

@Injectable({ providedIn: "root" })
export class ChartsHelper {
  public static renderDailyAchievementChart(
    calculation,
    stockType: StockTypeModel,
    usedStockKey: string,
    cities: CityModel[]
  ) {
    const name = ReportsHelper.getStringReplacementForUsedStockKey(
      false,
      usedStockKey
    );
    const title = ReportsHelper.getStringReplacementForUsedStockKey(
      true,
      usedStockKey
    );
    const categories = Object.keys(calculation);
    const series: BarChartSeries[] = [
      {
        name: `Actual Daily ${name}`,
        data: categories.map((key) => {
          const item = calculation[key];
          return Math.round(item[usedStockKey] / item.completedDays);
        }),
      },
      {
        name: `Target Daily ${name}`,
        data: categories.map((key) => {
          const item = calculation[key];
          return Math.round(item.planned / item.duration);
        }),
      },
    ];

    const chartTitle = `Daily ${title} Achivement`;

    return ChartsHelper.getChartOptions(
      chartTitle,
      350,
      series,
      `${stockType.name} daily-achievement-report`,
      "Location",
      categories.map((key) => cities.find((l) => l.id === key).name)
    );
  }

  public static renderMTDAchievementChart(
    calculation,
    stockType: StockTypeModel,
    usedStockKey: string,
    cities: CityModel[]
  ) {
    const title = ReportsHelper.getStringReplacementForUsedStockKey(
      true,
      usedStockKey
    );
    const categories = Object.keys(calculation);
    const series: BarChartSeries[] = [
      {
        name: "Percent Achievement",
        data: categories.map((key) => {
          const item = calculation[key];
          return Math.round((item[usedStockKey] / item.planned) * 100);
        }),
      },
      {
        name: "Percent Time",
        data: categories.map((key) => {
          const item = calculation[key];
          return Math.round((item.completedDays / item.duration) * 100);
        }),
      },
    ];

    const chartTitle = `MTD ${title} Achivement`;

    return ChartsHelper.getChartOptions(
      chartTitle,
      350,
      series,
      `${stockType.name} mtd-achievement-report`,
      "Location",
      categories.map((key) => cities.find((l) => l.id === key).name)
    );
  }

  public static renderStockDetailChart(
    stockDetailsData,
    stockType: StockTypeModel,
    usedStockKey: string,
    chartByCity: boolean
  ) {
    let chartTitle = `${stockType.name} Detail`;

    if (!Object.keys(stockDetailsData).length) {
      return;
    }

    const data = chartByCity
      ? Object.keys(stockDetailsData).map(
          (c) => stockDetailsData[c][stockType.id]
        )
      : Object.keys(stockDetailsData).map((c) => stockDetailsData[c]);

    const series: BarChartSeries[] = [
      {
        name: "Planned",
        data: data.map((item) => item.planned),
      },
      {
        name: "Received",
        data: data.map((item) => item.received),
      },
      {
        name: Utility.capitalizeFirstLetter(usedStockKey),
        data: data.map((item) => item[usedStockKey]),
      },
      {
        name: "In Hand",
        data: data.map((item) => item["in hand"]),
      },
    ];

    return ChartsHelper.getChartOptions(
      chartTitle,
      350,
      series,
      `${stockType.name} detail-report`,
      "Location",
      data.map((item) => item.location)
    );
  }

  public static renderTotalDurationChart(
    calculation,
    stockType: StockTypeModel,
    usedStockKey: string,
    cities: CityModel[]
  ) {
    const title = ReportsHelper.getStringReplacementForUsedStockKey(
      true,
      usedStockKey
    );
    const categories = Object.keys(calculation);
    const series: BarChartSeries[] = [
      {
        name: "Days Completed",
        data: categories.map((key) => {
          const item = calculation[key];
          return item.completedDays || 0;
        }),
      },
      {
        name: "Days Left",
        data: categories.map((key) => {
          const item = calculation[key];
          return item.duration - (item.completedDays || 0);
        }),
      },
    ];

    const chartTitle = `Total ${title} Duration`;

    return ChartsHelper.getChartOptions(
      chartTitle,
      350,
      series,
      `${stockType.name} total-duration-report`,
      "Location",
      categories.map((key) => cities.find((l) => l.id === key).name)
    );
  }

  public static getChartOptions(
    title: string,
    height: number,
    series: BarChartSeries[],
    fileName: string,
    categoryTitle?: string,
    categories?: string[]
  ): ChartOptions {
    return {
      chart: {
        type: "bar",
        height: height,
        toolbar: {
          export: {
            svg: {
              filename: fileName,
            },
            png: {
              filename: fileName,
            },
            csv: {
              filename: fileName,
              headerCategory: categoryTitle,
            },
          },
        },
      },
      series: series,
      xaxis: {
        categories: categories,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      title: {
        text: title,
        align: "center",
      },
      dataLabels: {
        enabled: true,
      },
    };
  }
}
