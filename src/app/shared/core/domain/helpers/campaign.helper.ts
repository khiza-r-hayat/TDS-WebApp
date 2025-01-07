import { Utility } from "../../classes/utility";
import {
  CampaignModel,
  CampaignTeamStock,
  CampaignTeamStockDetail,
  CampaignUpload,
} from "../models/campaign.modal";
import { EventModel } from "../models/event.model";
import { Sponsor } from "../models/sponsor.model";

export class CampaignHelper {
  public static generateCampaignObject(
    sponsor: Sponsor,
    event: EventModel,
    userId: string
  ): CampaignUpload {
    return {
      title: event.title,
      eventId: event.id,
      sponsorId: sponsor.id,
      addedBy: userId,
      updatedBy: userId,
      pitch: event.pitch,
      status: false,
      disclaimer: false,
    };
  }

  static generateCampaignTeamStock(
    locationData: any,
    stockId: string,
    campaign: CampaignModel,
    userId: string,
    supervisorId: string
  ): CampaignTeamStock {
    return {
      id: stockId,
      campaignId: campaign.id,
      teamId: locationData.teamId,
      assignedTo: supervisorId,
      brandId: campaign.event.brands[0].brandId,
      productId: locationData.product,
      areaId: locationData.area,
      createdBy: userId,
      updatedBy: userId,
      individual: false,
      stockDate: new Date(Utility.formatDate(locationData.stockDate)),
    };
  }

  static generateCampaignTeamStockDetail(
    stockData: any,
    stockId: string,
    detailId: string
  ): CampaignTeamStockDetail {
    return {
      id: detailId,
      teamStockId: stockId,
      batchCode: stockData.batchCode,
      stockTypeId: stockData.stockTypeId,
      stockQuantity: stockData.quantity,
      returnStockQuantity: 0,
      damagedStockQuantity: 0,
    };
  }

  static generateUploadbleStockObject(stock: CampaignTeamStock) {
    return {
      id: stock.id,
      campaignId: stock.campaignId,
      teamId: stock.teamId,
      assignedTo: stock.assignedTo,
      brandId: stock.brandId,
      productId: stock.productId,
      areaId: stock.areaId,
      createdBy: stock.createdBy,
      updatedBy: stock.updatedBy,
      individual: false,
      stockDate: stock.stockDate,
      stockDetails: stock.stockDetails.map((detail) => ({
        id: detail.id,
        teamStockId: detail.teamStockId,
        batchCode: detail.batchCode,
        stockTypeId: detail.stockTypeId,
        stockQuantity: detail.stockQuantity,
        returnStockQuantity: detail.returnStockQuantity,
        damagedStockQuantity: detail.damagedStockQuantity,
      })),
    };
  }
}
