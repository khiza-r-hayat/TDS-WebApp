import { Utility } from "../../classes/utility";
import {
  EventBrandRequest,
  EventBrandsDataRequest,
  EventChecklistRequest,
  EventChecklistsDataRequest,
  EventModel,
  EventRequest,
  EventSponsorStock,
  EventSponsorStockDetailDataUpload,
  EventSponsorStockDetailUpload,
  EventSponsorStockUpload,
  EventStockTypeData,
  EventStockTypeDataRequest,
} from "../models/event.model";

export class EventHelper {
  static prepareEventRequest(
    _eventForm: any,
    eventSetup: EventModel
  ): EventRequest {
    let eventSkus: EventBrandRequest[] = _eventForm.sku.map((sku) => ({
      brandId: _eventForm.brand,
      productId: sku,
    }));

    let eventBrands: EventBrandsDataRequest = {
      data: eventSkus,
    };

    let eventChecklist: EventChecklistRequest[] = _eventForm.checklists.map(
      (sku) => ({
        checklistId: sku,
      })
    );

    let eventChecklists: EventChecklistsDataRequest = {
      data: eventChecklist,
    };

    let eventStockType: EventStockTypeData[] = _eventForm.stocktypes.map(
      (sku) => ({
        stockTypeId: sku,
      })
    );

    let eventStockTypes: EventStockTypeDataRequest = {
      data: eventStockType,
    };

    const { startDateUTC, endDateUTC } = Utility.adjustStartAndEndDates(
      _eventForm.startDate,
      _eventForm.endDate
    );

    return {
      id: eventSetup ? eventSetup.id : Utility.generateUUID(),
      tenantId: "874be33c-7c3a-45e4-9cb5-60fa12575f64",
      title: _eventForm.name,
      type: _eventForm.type,
      deal: _eventForm.deal,
      address: "",
      startDate: startDateUTC,
      endDate: endDateUTC,
      status: true,
      eventImage: "",
      addedBy: "5238e046-df8d-4d05-9d8b-f5fa366d7eb0",
      updatedBy: "5238e046-df8d-4d05-9d8b-f5fa366d7eb0",
      brands: eventBrands,
      checklists: eventChecklists,
      evnetStockTypes: eventStockTypes,
      pitch: _eventForm.pitch,
      interactionType: _eventForm.interactionType,
      totalContacts:
        _eventForm.totalContacts === "" ? 0 : _eventForm.totalContacts,
      plannedSellingStocks:
        _eventForm.plannedSellingStocks === ""
          ? 0
          : _eventForm.plannedSellingStocks,
      plannedSOGStocks:
        _eventForm.plannedSOGStocks === "" ? 0 : _eventForm.plannedSOGStocks,
      plannedGiveawayStocks:
        _eventForm.plannedGiveawayStocks === ""
          ? 0
          : _eventForm.plannedGiveawayStocks,
      productivityTarget:
        _eventForm.productivityTarget === ""
          ? 0
          : _eventForm.productivityTarget,
      activationDays:
        _eventForm.activationDays === "" ? 0 : _eventForm.activationDays,
    };
  }

  static mapToEventSponsorStockUploadable(
    stocks: EventSponsorStock[]
  ): EventSponsorStockUpload[] {
    return stocks.map(
      (stock) =>
        ({
          id: stock.id,
          eventId: stock.eventId,
          sponsorId: stock.sponsorId,
          brandId: stock.brandId,
          productId: stock.productId,
          areaId: stock.areaId,
          createdBy: stock.createdBy,
          updatedBy: stock.updatedBy,
          plannedSellingStocks: stock.plannedSellingStocks,
          plannedSOGStocks: stock.plannedSOGStocks,
          plannedGiveawayStocks: stock.plannedGiveawayStocks,
          stockDetails: stock.stockDetails.map(
            (s) =>
              ({
                data: EventHelper.generateEventSponsorStockDetail(
                  s,
                  s.sponsorStockId,
                  s.id
                ),
              } as EventSponsorStockDetailDataUpload)
          ),
        } as EventSponsorStockUpload)
    );
  }

  static generateEventSponsorStock(
    locationData: any,
    stockId: string,
    event: EventModel,
    userId: string
  ): EventSponsorStockUpload {
    return {
      id: stockId,
      eventId: event.id,
      sponsorId: locationData.sponsor,
      brandId: event.brands[0].brandId,
      productId: locationData.product,
      areaId: locationData.area,
      plannedSellingStocks: locationData.plannedSellingStocks,
      plannedSOGStocks: locationData.plannedSOGStocks,
      plannedGiveawayStocks: locationData.plannedGiveawayStocks,
      createdBy: userId,
      updatedBy: userId,
    };
  }

  static generateEventSponsorStockDetail(
    stockData: any,
    stockId: string,
    detailId: string
  ): EventSponsorStockDetailUpload {
    return {
      id: detailId,
      sponsorStockId: stockId,
      title: stockData.title,
      description: stockData.description,
      batchCode: stockData.batchCode,
      quantity: stockData.quantity,
      expiry:
        stockData.expiry && stockData.expiry !== ""
          ? new Date(Utility.formatDate(stockData.expiry))
          : null,
      stockTypeId: stockData.stockTypeId,
    };
  }
}
