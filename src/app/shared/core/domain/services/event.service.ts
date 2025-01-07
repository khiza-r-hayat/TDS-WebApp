import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import {
  ChecklistModel,
  ChecklistModelResponse,
  CityModel,
  CustomFormElement,
  CustomFormElementOption,
  EventInventory,
  EventInventoryUpload,
  EventModel,
  EventRequest,
  EventSponsorStock,
  EventSponsorStockDetailUpload,
  EventSponsorStockUpload,
  StockTypeModel,
  StockTypeModelResponse,
} from "app/shared/core/domain/models/event.model";
import { EventRepository } from "../repository/event.repository";
import { EventSponsorUpload, Sponsor } from "../models/sponsor.model";
import { LogService } from "app/shared/logs/log.service";
import { MessageService } from "../../classes/message.service";
import { ChecklistMapper } from "../../data/api/event/checklist.mapper";
import { StockTypeMapper } from "../../data/api/event/stocktype.mapper";
import { SponsorService } from "./sponsor.service";
import { EventHelper } from "../helpers/event.helper";
import { CampaignUpload } from "../models/campaign.modal";

@Injectable({ providedIn: "root" })
export class EventService {
  // Private signals
  private _event = signal<EventModel | null>(null);
  private _events = signal<EventModel[]>([]);
  private _checklists = signal<ChecklistModel[]>([]);
  private _stocktypes = signal<StockTypeModel[]>([]);
  private _locations = signal<CityModel[]>([]);
  private _eventSponsorStock = signal<EventSponsorStockUpload[]>([]);

  private repository = inject(EventRepository);
  private sponsorService = inject(SponsorService);
  private checklistMapper = new ChecklistMapper();
  private stockTypeMapper = new StockTypeMapper();
  // private logger = inject(LogService);
  private messageService = inject(MessageService);

  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for event
   */
  get event() {
    return this._event;
  }

  /**
   * Getter for events
   */
  get events() {
    return this._events;
  }
  /**
   * Getter for checklists
   */
  get checklists() {
    return this._checklists;
  }
  /**
   * Getter for stocktypes
   */
  get stocktypes() {
    return this._stocktypes;
  }
  /**
   * Getter for locations
   */
  get locations() {
    return this._locations;
  }
  /**
   * Getter for eventSponsorStock
   */
  get eventSponsorStock() {
    return this._eventSponsorStock;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Reset methods
  // -----------------------------------------------------------------------------------------------------

  resetEventSignal() {
    this._event.set(null);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Get methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get Events By Tenant
   */
  getEventByTenant(id: string): Observable<EventModel[]> {
    return this.repository.getEventByTenant(id).pipe(
      catchError((e) => {
        console.log("Error fetching events by tenant!", e, id);
        this.messageService.errorMessage("Failed to fetch events by tenant!");
        return of(null);
      }),
      tap((response: any) => {
        if (response) {
          this._events.set(response);
        }
      })
    );
  }

  getEventsByTenantForDashboard(id: string): Observable<EventModel[]> {
    return this.repository.getEventsByTenantForDashboard(id).pipe(
      catchError((e) => {
        console.log("Error fetching events by tenant!", e, id);
        this.messageService.errorMessage("Failed to fetch Dashboard!");
        return of(null);
      }),
      tap((response: EventModel[]) => {
        if (response) {
          this._events.set(response);
        }
      })
    );
  }

  getDashboardCampaignEvent(
    tenantId: string,
    sponsorId: string
  ): Observable<EventModel[]> {
    return this.repository.getDashboardCampaignEvent(tenantId, sponsorId).pipe(
      catchError((e) => {
        console.log(
          "Error fetching events by tenant and sponsor with campaign!",
          e,
          tenantId,
          sponsorId
        );
        this.messageService.errorMessage("Failed to load dashboard!");
        return of(null);
      }),
      tap((response: EventModel[]) => {
        if (response) {
          this._events.set(response);
          this._event.set(response[0]);
        }
      })
    );
  }

  getEventByIdForDashoboard(id: string): Observable<EventModel[]> {
    return this.repository.getEventByIdForDashoboard(id).pipe(
      catchError((e) => {
        console.log("Error fetching event!", e, id);
        this.messageService.errorMessage("Failed to fetch event!");
        return of(null);
      }),
      tap((response: EventModel[]) => {
        if (response) {
          this._event.set(response[0]);
        }
      })
    );
  }

  getChecklistsAndStockTypesByTenantId(id: string): Observable<any> {
    return this.repository.getChecklistsAndStockTypesByTenantId(id).pipe(
      catchError((e) => {
        console.log(
          "Error fetching checklists and stockTypes by tenant!",
          e,
          id
        );
        this.messageService.errorMessage(
          "Failed to fetch checklists and stockTypes by tenant!"
        );
        return of(null);
      }),
      tap((response: any) => {
        if (response) {
          // console.log(
          //   "Fetched checklists and stocktypes successfuly!",
          //   response
          // );
          const checklists = response[
            "checklist"
          ].map((c: ChecklistModelResponse) => this.checklistMapper.mapFrom(c));
          const stockTypes = response[
            "stock_type"
          ].map((s: StockTypeModelResponse) => this.stockTypeMapper.mapFrom(s));

          this._checklists.set(checklists);
          this._stocktypes.set(stockTypes);
        }
      })
    );
  }

  /**
   * Get Event Information
   */
  getEventById(id: string): Observable<EventModel> {
    return this.repository.getEventById(id).pipe(
      catchError((e) => {
        console.log("Error fetching event!", e, id);
        this.messageService.errorMessage("Failed to fetch event!");
        return of(null);
      }),
      tap((response: EventModel) => {
        if (response) {
          this._event.set(response[0]);
        }
      })
    );
  }

  getLocations(): Observable<CityModel[]> {
    return this.repository.getLocations().pipe(
      catchError((e) => {
        console.log("Error fetching locations by tenant!", e);
        this.messageService.errorMessage(
          "Failed to fetch locations by tenant!"
        );
        return of(null);
      }),
      tap((response: CityModel[]) => {
        if (response) {
          this._locations.set(response);
        }
      })
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Upsert methods
  // -----------------------------------------------------------------------------------------------------

  addEvent(
    eventRequest: EventRequest,
    update: boolean
  ): Observable<EventModel> {
    return this.repository.addEvent(eventRequest, update).pipe(
      catchError((e) => {
        console.log("Error uploading event!", e);
        this.messageService.errorMessage("Failed to upload event!");
        return of(null);
      }),
      tap((response: EventModel) => {
        this._event.set(response[0]);
      })
    );
  }

  upsertEventElements(
    elements: CustomFormElement,
    options: CustomFormElementOption[]
  ): Observable<number> {
    return this.repository.upsertEventElements(elements, options).pipe(
      catchError((e) => {
        console.log("Error uploading event elements!", e);
        this.messageService.errorMessage("Failed to upload event elements!");
        return of(null);
      })
    );
  }

  upsertEventSponsors(
    sponsors: EventSponsorUpload[],
    campaigns: CampaignUpload[]
  ): Observable<number> {
    return this.repository
      .upsertEventSponsorsWitchCampaigns(sponsors, campaigns)
      .pipe(
        catchError((e) => {
          console.log(
            "Error uploading event sponsors with campaigns!",
            e,
            sponsors[0].eventId
          );
          this.messageService.errorMessage("Error uploading event sponsors!");
          return of(null);
        })
      );
  }

  upsertEventSponsorStock() {
    const stockDetails = this.eventSponsorStock().flatMap((obj) =>
      obj.stockDetails.map((d) => d.data)
    ); // Extract stockDetails
    const stockList = this.eventSponsorStock().map(
      ({ stockDetails, ...rest }) => rest
    ); // Eliminate stockDetails
    return this.repository
      .upsertEventSponsorStock(stockList, stockDetails)
      .pipe(
        catchError((e) => {
          console.log(
            "Error uploading event sponsor stock!",
            e,
            stockList,
            stockList[0].eventId
          );
          this.messageService.errorMessage(
            "Error uploading event sponsor stock!"
          );
          return of(null);
        })
      );
  }

  upsertEventInventory(inventories: EventInventoryUpload[]) {
    return this.repository.upsertEventInventory(inventories).pipe(
      catchError((e) => {
        console.log(
          "Error uploading event inventory!",
          e,
          inventories,
          inventories[0].eventId
        );
        this.messageService.errorMessage("Error uploading event inventory!");
        return of(null);
      })
    );
  }

  //locally update event sponsor stock
  updateEventSponsorStock(
    stockData: EventSponsorStockUpload,
    stockDetail: EventSponsorStockDetailUpload,
    addDetail?: boolean
  ) {
    let stock: EventSponsorStockUpload[] = [...this._eventSponsorStock()];

    const index = stock.findIndex((s) => s.id === stockData.id);

    if (index > -1) {
      stock[index]["plannedSellingStocks"] = stockData.plannedSellingStocks;
      stock[index]["plannedSOGStocks"] = stockData.plannedSOGStocks;
      stock[index]["plannedGiveawayStocks"] = stockData.plannedGiveawayStocks;
      if (!addDetail) return;
      let details = stock[index].stockDetails;
      const i = details.findIndex((d) => d.data.id === stockDetail.id);
      if (i === -1) {
        details.push({ data: stockDetail });
      } else {
        details[i] = { data: stockDetail };
      }
    } else {
      if (addDetail) {
        stockData.stockDetails = [{ data: stockDetail }];
      }
      stock.push(stockData);
    }

    this._eventSponsorStock.set(stock);
  }

  updateEventSponsorStockDetail(
    stockDetail: EventSponsorStockDetailUpload,
    update: boolean
  ) {
    let stock: EventSponsorStockUpload[] = [...this._eventSponsorStock()];

    const index = stock.findIndex((s) => s.id === stockDetail.sponsorStockId);

    if (index > -1) {
      let details = stock[index].stockDetails;
      let i = details.findIndex((d) => d.data.id === stockDetail.id);
      if (i > -1) {
        if (update) {
          //update detail
          details[i].data = stockDetail;
        } else {
          //remove detail
          details.splice(i, 1);
        }
      }
    }

    this._eventSponsorStock.set(stock);
  }

  //convert EventSponsorStock[] to EventSponsorStockUpload[] and set signal value
  setEventSponsorStock(stocks: EventSponsorStock[]) {
    this._eventSponsorStock.set(
      EventHelper.mapToEventSponsorStockUploadable(stocks)
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Delete methods
  // -----------------------------------------------------------------------------------------------------

  deleteEventElements(
    fieldsToDelete: number[],
    optionsToDelete: number[]
  ): Promise<boolean> {
    return this.repository.deleteEventElements(fieldsToDelete, optionsToDelete);
  }

  deleteEventSponsors(sponsors: Sponsor[], eventId: string) {
    const ids = sponsors.map((s) => s.id);
    return this.repository
      .deleteEventSponsors(ids, eventId)
      .pipe(
        catchError((e) => {
          console.log("Error deleting event sponsors!", e);
          this.messageService.errorMessage(
            `Failed to delete ${
              ids.length === 1 ? "event sponsor" : "event sponsors"
            }!`
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          console.log(
            `deleted ${
              ids.length === 1 ? "event sponsor" : "event sponsors"
            } successfuly!`,
            ids
          );
          this.deleteEventSponsorLocally(sponsors, eventId);
        }
      });
  }

  deleteEventSponsorLocally(sponsors: Sponsor[], eventId: string) {
    const ids = sponsors.map((s) => s.id);

    //remove deleted sponsors stock
    this._eventSponsorStock.update((stock) =>
      stock.filter(
        (ess) =>
          ess.eventId === eventId &&
          !sponsors.some((s) => s.id === ess.sponsorId)
      )
    );
    //remove event sponsors from event
    this._event.update((event) => {
      event.sponsors = event.sponsors.filter(
        (v) => !ids.some((a) => a === v.sponsorId)
      );
      return event;
    });
    //remove event sponsors form sponsor service
    this.sponsorService.removeEventSponsors(sponsors);
  }

  deleteEventSponsorStockDetails(stocks: EventSponsorStockDetailUpload[]) {
    const ids = stocks.map((s) => s.id);
    return this.repository.deleteEventSponsorStockDetails(ids).pipe(
      catchError((e) => {
        console.log(
          `Error deleting event sponsor stock ${
            ids.length === 1 ? "detail" : "details"
          }!`,
          e
        );
        this.messageService.errorMessage(
          `Failed to delete event sponsor stock ${
            ids.length === 1 ? "detail" : "details"
          }!`
        );
        return of(null);
      })
    );
  }

  deleteEventInventory(inventory: EventInventoryUpload[]) {
    const ids = inventory.map((s) => s.id);
    return this.repository.deleteEventInventory(ids).pipe(
      catchError((e) => {
        console.log(
          `Error deleting ${ids.length === 1 ? "inventory" : "inventories"}!`,
          e
        );
        this.messageService.errorMessage(
          `Failed to delete ${ids.length === 1 ? "inventory" : "inventories"}!`
        );
        return of(null);
      })
    );
  }
}
