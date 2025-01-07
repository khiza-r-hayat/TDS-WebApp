import { Utility } from "../../classes/utility";
import {
  CampaignDeploymentPlan,
  CampaignTeamStock,
  CampaignTeamStockDetail,
} from "../models/campaign.modal";
import { FilterModel } from "../models/common.model";
import {
  EventModel,
  EventSponsorStock,
  EventSponsorStockDetail,
  StockTypeModel,
} from "../models/event.model";

export class ReportsHelper {
  public static calculateActivationDashoboard(
    event: EventModel,
    filter: FilterModel,
    stockType: StockTypeModel
  ) {
    const cityStockDetailsCalculation = this.getTotalStockCalculation(
      this.calculateStockInsight(event, filter),
      true
    );

    const otherDashboardReportsData = this.getGeneralDataForGraphCalculation(
      cityStockDetailsCalculation,
      event,
      filter,
      stockType
    );

    return {
      stockDetailCalculationByCity: cityStockDetailsCalculation,
      basicCalculationByCity: otherDashboardReportsData,
    };
  }

  public static getGeneralDataForGraphCalculation(
    cityStockDetailsCalculation: Object,
    event: EventModel,
    filter: FilterModel,
    stockType: StockTypeModel
  ) {
    const usedStockKey = this.getKeyForUsedStock(stockType);
    const deploymentPlans = this.filterDeploymentPlans(
      event,
      filter.endDate,
      filter.selections
    );
    const leadSubmissions = this.filterLeadSubmissions(event, filter);
    const reportData = this.calculateDashboardReportData(
      cityStockDetailsCalculation,
      deploymentPlans,
      leadSubmissions,
      usedStockKey
    );

    return reportData;
  }

  private static calculateDashboardReportData(
    cityStockDetails: Object,
    deploymentPlans: CampaignDeploymentPlan[],
    leadSubmissions: { cityId: string; createdAt: Date }[],
    usedStockKey: string
  ) {
    let data = {};

    for (let plan of deploymentPlans) {
      data[plan.area.cityId] = {
        duration: plan.duration,
      };
    }

    for (let cityId in cityStockDetails) {
      for (let key in cityStockDetails[cityId]) {
        data[cityId][usedStockKey] =
          cityStockDetails[cityId][key][usedStockKey];
        data[cityId]["planned"] = cityStockDetails[cityId][key]["planned"];
      }
    }

    for (let submission of leadSubmissions) {
      if (!data[submission.cityId]["completedDays"]) {
        data[submission.cityId]["completedDays"] = 1;
        continue;
      }
      data[submission.cityId]["completedDays"] += 1;
    }

    return data;
  }

  private static filterDeploymentPlans(
    event: EventModel,
    endDate?: string,
    cityIds?: string[]
  ) {
    return event.campaigns.flatMap((c) =>
      c.deploymentPlans.filter((d) =>
        endDate
          ? new Date(d.endDate) >= new Date(endDate)
          : true && cityIds
          ? cityIds.some((c) => c === d.area.cityId)
          : true
      )
    );
  }

  public static filterLeadSubmissions(event: EventModel, filter: FilterModel) {
    return Array.from(
      new Map(
        event.campaigns
          .flatMap((c) =>
            c.submissions
              .filter((s) =>
                filter.selections.some((id) => id === s.stock.area.cityId)
              )
              .map(({ stock: { area: { cityId } }, createdAt }) => ({
                cityId,
                createdAt,
              }))
          )
          .map((item) => [`${item.cityId}-${item.createdAt}`, item]) // Combine cityId and createdAt as a unique key
      ).values()
    );
  }

  public static getKeyForUsedStock(stockType: StockTypeModel): string {
    return stockType.name.trim().toLocaleLowerCase().includes("selling")
      ? "sold"
      : "sampled";
  }

  public static getStringReplacementForUsedStockKey(
    title: boolean,
    key: string
  ): string {
    return key === "sold"
      ? title
        ? "selling"
        : "sale"
      : title
      ? "sampling"
      : "sample";
  }

  public static calculateStockInsight(event: EventModel, filter: FilterModel) {
    const filteredStock = this.filterStocks(
      event,
      filter ? filter.startDate : undefined,
      filter ? filter.endDate : undefined,
      filter ? filter.selections : undefined
    );

    let stockData = this.calculateStockDetails(
      filteredStock["sponsorStockData"],
      filteredStock["teamStockData"],
      filter ? filter.stockType : undefined
    );

    const sum = this.calculateStockSums(event, stockData);
    //sub object structure
    // {
    //   brandId:{
    //     productId:
    //     {cityId:{
    //       stockTypeId:calculationObj
    //     }}
    //   }
    // }

    return sum;
  }

  public static getTotalStockCalculation(input: any, calculateByCity: boolean) {
    const output = {};
    for (const brandId in input) {
      for (const productId in input[brandId]) {
        for (const cityId in input[brandId][productId]) {
          for (const stockKey in input[brandId][productId][cityId]) {
            const stock = input[brandId][productId][cityId][stockKey];
            if (calculateByCity) {
              if (!output[cityId]) {
                output[cityId] = {};
                output[cityId][stockKey] = { ...stock };
              } else {
                // Sum values for matching stockKey
                for (let key in stock) {
                  if (key !== "name" && key !== "location") {
                    output[cityId][stockKey][key] += stock[key];
                  }
                }
              }
            } else {
              if (!output[stockKey]) {
                output[stockKey] = { ...stock };
              } else {
                // Sum values for matching stockKey
                for (let key in stock) {
                  if (key !== "name" && key !== "location") {
                    output[stockKey][key] += stock[key];
                  }
                }
              }
            }
          }
        }
      }
    }
    return output;
  }

  private static calculateStockSums(event: EventModel, stockDataObject) {
    const stockTypes = event.evnetStockTypes.map((s) => s.stockType);
    const cities = event.eventSponsorStocks.flatMap((s) => s.area.city);
    const sponsorStockData = stockDataObject.sponsorStockData;
    const teamStockData = stockDataObject.teamStockData;

    let stockSum = {};
    for (let brandId in teamStockData) {
      if (!stockSum[brandId]) {
        stockSum[brandId] = {};
      }
      for (let productId in teamStockData[brandId]) {
        if (!stockSum[brandId][productId]) {
          stockSum[brandId][productId] = {};
        }
        for (let cityId in teamStockData[brandId][productId]) {
          if (!stockSum[brandId][productId][cityId]) {
            stockSum[brandId][productId][cityId] = {};
          }
          let teamStock = teamStockData[brandId][productId][cityId];
          for (let stockTypeId in teamStock) {
            let stock = teamStock[stockTypeId];
            let sponsorStock =
              sponsorStockData[brandId][productId][cityId][stockTypeId];
            const stockType = stockTypes.find((s) => s.id === stockTypeId);
            const usedStockKey = this.getKeyForUsedStock(stockType);

            stockSum[brandId][productId][cityId][stockTypeId] = {
              name: stockType.name.trim().toLowerCase(),
              location: cities.find((c) => c.id === cityId).name,
              planned: sponsorStock["planned"],
              received: sponsorStock["assigned"],
              "in hand":
                sponsorStock["assigned"] - (stock.assigned - stock.return),
            };
            stockSum[brandId][productId][cityId][stockTypeId][usedStockKey] =
              stock.assigned - stock.return;
          }
        }
      }
    }
    return stockSum;
  }

  private static filterStocks(
    event: EventModel,
    startDate: any,
    endDate: any,
    cityIds?: string[]
  ) {
    const filteredSponsorStock = cityIds
      ? event.eventSponsorStocks?.filter((item) =>
          cityIds.some((c) => c === item.area.cityId)
        )
      : event.eventSponsorStocks ?? [];

    const teamStock = event.campaigns?.flatMap((camp) => camp.teamsStock || []);
    const filterByCity = cityIds && cityIds.length > 0;
    const filterByDate = startDate && endDate;
    const filteredTeamStock = teamStock.filter((s) =>
      s.individual && filterByCity
        ? cityIds.some((c) => c === s.area.cityId)
        : true && filterByDate
        ? Utility.isDateBetween(s.stockDate, startDate, endDate)
        : true
    );

    return {
      sponsorStockData: filteredSponsorStock,
      teamStockData: filteredTeamStock,
    };
  }

  private static calculateStockDetails(
    sponsorStockData: EventSponsorStock[],
    teamStockData: CampaignTeamStock[],
    stockType?: string
  ) {
    let sposnorStockDetailsByCity = {};
    let teamStockDetailsByCity = {};

    for (let stock of sponsorStockData) {
      let sposnorStockDetails = stock.stockDetails.filter((d) =>
        stockType ? d.stockTypeId === stockType : d
      );
      if (!sposnorStockDetailsByCity[stock.brandId]) {
        sposnorStockDetailsByCity[stock.brandId] = {};
        sposnorStockDetailsByCity[stock.brandId][stock.productId] = {};
      }
      sposnorStockDetailsByCity[stock.brandId][stock.productId][
        stock.area.cityId
      ] = this.calculateSponsorStock(stock, sposnorStockDetails, stockType);
    }

    for (let stock of teamStockData) {
      let teamStockDetails = stock.stockDetails.filter((d) =>
        stockType ? d.stockTypeId === stockType : d
      );
      if (!teamStockDetailsByCity[stock.brandId]) {
        teamStockDetailsByCity[stock.brandId] = {};
        teamStockDetailsByCity[stock.brandId][stock.productId] = {};
      }

      teamStockDetailsByCity[stock.brandId][stock.productId][
        stock.area.cityId
      ] = this.calculateTeamStock(teamStockDetails, stockType);
    }

    return {
      sponsorStockData: sposnorStockDetailsByCity,
      teamStockData: teamStockDetailsByCity,
    };
  }

  private static calculateTeamStock(
    teamStockDetails: CampaignTeamStockDetail[],
    stockType
  ) {
    let teamStock = {};
    teamStockDetails.forEach((element) => {
      const typeId = stockType ? stockType : element.stockTypeId;
      if (!teamStock[typeId]) {
        teamStock[typeId] = {};
        teamStock[typeId]["assigned"] = element.stockQuantity;
        teamStock[typeId]["return"] = element.returnStockQuantity;
        teamStock[typeId]["damaged"] = element.damagedStockQuantity;
      } else {
        teamStock[typeId]["assigned"] += element.stockQuantity;
        teamStock[typeId]["return"] += element.returnStockQuantity;
        teamStock[typeId]["damaged"] += element.damagedStockQuantity;
      }
    });
    return teamStock;
  }

  private static calculateSponsorStock(
    sponsorStocks: EventSponsorStock,
    sponsorStockDetails: EventSponsorStockDetail[],
    stockType?: string
  ) {
    let sponsorStockData = {};
    for (let element of sponsorStockDetails) {
      const typeId = stockType ? stockType : element.stockTypeId;
      if (!sponsorStockData[typeId]) {
        sponsorStockData[typeId] = {};
        sponsorStockData[typeId]["planned"] = this.getPlanedTotalByStockTypeId(
          element.stockType,
          sponsorStocks
        ).total;
        sponsorStockData[typeId]["assigned"] = element.quantity;
      } else {
        sponsorStockData[typeId]["assigned"] += element.quantity;
      }
    }
    return sponsorStockData;
  }

  private static getPlanedTotalByStockTypeId(
    stockType: StockTypeModel,
    data: EventSponsorStock
  ) {
    const name = stockType.name.trim().toLowerCase();
    let total = 0;

    if (name.includes("selling")) total = data.plannedSellingStocks;
    if (name.includes("sog")) total = data.plannedSOGStocks;
    if (name.includes("give")) total = data.plannedGiveawayStocks;

    return { total: total, name: Utility.capitalizeEachWord(name) };
  }
}
