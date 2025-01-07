import {
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTooltip,
} from "ng-apexcharts";

export interface ChartOptions {
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  series: { name: string; data: number[] }[];
  plotOptions: ApexPlotOptions;
}

export interface BarChartSeries {
  name: string;
  data: number[];
}

export interface FilterModel {
  startDate: string;
  endDate: string;
  selections: string[];
  stockType?: string;
}

export interface StockStats {
  name: string;
  total: number;
  received: number;
  used: number;
  inHand: number;
}
