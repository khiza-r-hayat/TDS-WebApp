import { Observable } from "rxjs";
import {
  CityModel,
  CustomFormElement,
  CustomFormElementOption,
  EventInventoryUpload,
  EventModel,
  EventRequest,
  EventSponsorStockDetailUpload,
  EventSponsorStockUpload,
} from "../models/event.model";
import { EventSponsorUpload } from "../models/sponsor.model";
import { CampaignUpload } from "../models/campaign.modal";

export abstract class EventRepository {
  abstract getEventByTenant(id: string): Observable<any[]>;
  abstract getEventsByTenantForDashboard(id: string): Observable<EventModel[]>;
  abstract getDashboardCampaignEvent(
    tenantId: string,
    sponsorId: string
  ): Observable<EventModel[]>;
  abstract getEventByIdForDashoboard(id: string): Observable<EventModel[]>;
  abstract getChecklistsAndStockTypesByTenantId(id: string): Observable<any[]>;
  abstract getEventById(id: string): Observable<EventModel>;
  abstract getLocations(): Observable<CityModel[]>;
  abstract addEvent(
    eventRequest: EventRequest,
    update: boolean
  ): Observable<EventModel>;
  abstract upsertEventElements(
    event: CustomFormElement,
    options: CustomFormElementOption[]
  ): Observable<number>;
  abstract upsertEventSponsorsWitchCampaigns(
    sponsors: EventSponsorUpload[],
    campaigns: CampaignUpload[]
  ): Observable<any>;
  abstract upsertEventSponsorStock(
    stocks: EventSponsorStockUpload[],
    stockDetails: EventSponsorStockDetailUpload[]
  ): Observable<any>;
  abstract upsertEventInventory(
    inventories: EventInventoryUpload[]
  ): Observable<any>;
  abstract deleteEventElements(
    fieldsToDelete: number[],
    optionsToDelete: number[]
  ): Promise<boolean>;
  abstract deleteEventSponsors(ids: string[], eventId: string);
  abstract deleteEventSponsorStockDetails(ids: string[]);
  abstract deleteEventInventory(ids: string[]);
}
