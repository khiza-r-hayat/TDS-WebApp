import {
  EventModel,
  EventResponse,
} from "app/shared/core/domain/models/event.model";
import { Mapper } from "../../../base/mapper";
import { Utility } from "app/shared/core/classes/utility";

export class EventMapper extends Mapper<EventResponse, EventModel> {
  mapFrom(param: EventResponse): any {
    return {
      id: param.id,
      tenantId: param.tenantId,
      title: param.title,
      type: param.type,
      deal: param.deal,
      startDate: Utility.parseToDate(param.startDate.toString()),
      endDate: Utility.parseToDate(param.endDate.toString()),
      address: param.address,
      zipCode: param.zipCode,
      city: param.city,
      state: this.getStatus(param.startDate, param.endDate),
      country: param.countryCode,
      countryCode: param.countryCode,
      eventImage: param.eventImage,
      integrationId: param.integrationId,
      externalEventId: param.externalEventId,
      status: param.status,
      addedBy: param.addedBy,
      updatedBy: param.updatedBy,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      interactionType: param.interactionType,
      totalContacts: param.totalContacts,
      plannedSellingStocks: param.plannedSellingStocks,
      plannedSOGStocks: param.plannedSOGStocks,
      plannedGiveawayStocks: param.plannedGiveawayStocks,
      productivityTarget: param.productivityTarget,
      activationDays: param.activationDays,
      pitch: param.pitch,
      brands: param.brands,
      checklists: param.checklists,
      evnetStockTypes: param.evnetStockTypes,
      eventSponsorStocks: param.eventSponsorStocks,
      eventInventory: param.eventInventory,
      elements: param.elements,
      sponsors: param.sponsors,
      campaigns: param.campaigns,
    };
  }

  mapTo(param: EventModel): EventResponse {
    return {
      id: param.id,
      tenantId: param.tenantId,
      title: param.title,
      type: param.type,
      deal: param.deal,
      startDate: param.startDate,
      endDate: param.endDate,
      address: param.address,
      zipCode: param.zipCode,
      city: param.city,
      state: this.getStatus(param.startDate, param.endDate),
      country: param.countryCode,
      countryCode: param.countryCode,
      eventImage: param.eventImage,
      integrationId: param.integrationId,
      externalEventId: param.externalEventId,
      status: param.status,
      addedBy: param.addedBy,
      updatedBy: param.updatedBy,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      brands: param.brands,
      checklists: param.checklists,
      evnetStockTypes: param.evnetStockTypes,
      eventSponsorStocks: param.eventSponsorStocks,
      eventInventory: param.eventInventory,
      elements: param.elements,
      sponsors: param.sponsors,
      campaigns: param.campaigns,
      interactionType: param.interactionType,
      totalContacts: param.totalContacts,
      plannedSellingStocks: param.plannedSellingStocks,
      plannedSOGStocks: param.plannedSOGStocks,
      plannedGiveawayStocks: param.plannedGiveawayStocks,
      productivityTarget: param.productivityTarget,
      activationDays: param.activationDays,
      pitch: param.pitch,
    };
  }

  getStatus(startDate, endDate) {
    const today = new Date().setHours(0, 0, 0, 0);
    const startDateObj = new Date(startDate).setHours(0, 0, 0, 0);
    const endDateObj = new Date(endDate).setHours(0, 0, 0, 0);

    if (today < startDateObj) {
      return "Upcoming";
    } else if (today >= startDateObj && today <= endDateObj) {
      return "Active";
    } else {
      return "Ended";
    }
  }
}
