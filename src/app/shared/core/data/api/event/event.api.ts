import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/event.gql";
import { EventRepository } from "app/shared/core/domain/repository/event.repository";
import { EventMapper } from "./event.mapper";
import {
  CityModel,
  CustomFormElement,
  CustomFormElementOption,
  EventInventoryUpload,
  EventModel,
  EventRequest,
  EventSponsorStockDetailUpload,
  EventSponsorStockUpload,
} from "app/shared/core/domain/models/event.model";
import { EventSponsorUpload } from "app/shared/core/domain/models/sponsor.model";
import { CityMapper } from "./city.mapper";
import { CampaignUpload } from "app/shared/core/domain/models/campaign.modal";
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class EventAPI implements EventRepository {
  private apollo = inject(Apollo);
  mapper = new EventMapper();
  cityMapper = new CityMapper();

  getEventByTenant(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getTenantEventQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["event"]),
        map((events) => events.map((e) => this.mapper.mapFrom(e)))
      );
  }

  getEventsByTenantForDashboard(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getTenantDashboardEventsQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["event"]),
        map((events) =>
          events.map((e) => ({ id: e.id, title: e.title } as EventModel))
        )
      );
  }

  getEventByIdForDashoboard(id: string): Observable<EventModel[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.DashboardEventWithCamapignsQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["event"]),
        map((events) => events.map((e) => this.mapper.mapFrom(e)))
      );
  }

  getDashboardCampaignEvent(
    tenantId: string,
    sponsorId: string
  ): Observable<EventModel[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getDashboardCampaignEventQL,
        variables: {
          tenantId: tenantId,
          sponsorId: sponsorId,
        },
      })
      .pipe(
        map((result) => result.data["event"]),
        map((events) =>
          events.map((e) => ({ id: e.id, title: e.title } as EventModel))
        )
      );
  }

  getChecklistsAndStockTypesByTenantId(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getChecklistsAndStockTypesByTenantIdQL,
        variables: {
          id: id,
        },
      })
      .pipe(map((result) => result.data));
  }

  getEventById(id: string): Observable<EventModel> {
    return this.apollo
      .subscribe<EventModel>({
        query: Query.getTenantIdQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["event"]),
        map((events) => events.map((e) => this.mapper.mapFrom(e)))
      );
  }

  getLocations(): Observable<any[]> {
    return this.apollo
      .subscribe<CityModel[]>({
        query: Query.getLocationsQL,
      })
      .pipe(
        map((result) => result.data["city"]),
        map((cities) => cities.map((c) => this.cityMapper.mapFrom(c)))
      );
  }

  addEvent(
    eventRequest: EventRequest,
    update: boolean
  ): Observable<EventModel> {
    const eventId = eventRequest.id;
    return this.apollo
      .subscribe<EventRequest>({
        query: Query.AddEventQL,
        variables: {
          objects: eventRequest,
          update: update,
          eventId: eventId,
        },
      })
      .pipe(
        map((item) => item.data["insert_event"].returning),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  upsertEventElements(
    elements: CustomFormElement,
    options: CustomFormElementOption[]
  ): Observable<number> {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.upsertEventElementsQL,
        variables: {
          objects: elements,
          options: options,
        },
      })
      .pipe(
        map((item) =>
          item ? item.data["insert_lead_form_element"].returning[0].id : 0
        )
      );
  }

  upsertEventSponsorsWitchCampaigns(
    sponsors: EventSponsorUpload[],
    campaigns: CampaignUpload[]
  ): Observable<any> {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.UpsertEventSponsorsWithCampaignsQL,
        variables: {
          sponsors: sponsors,
          campaigns: campaigns,
        },
      })
      .pipe(
        map((item) =>
          item ? item.data["insert_event_sponsor"].affected_rows : 0
        )
      );
  }

  upsertEventSponsorStock(
    stocks: EventSponsorStockUpload[],
    stockDetails: EventSponsorStockDetailUpload[]
  ): Observable<any> {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.UpsertSponsorStockQL,
        variables: {
          stocks: stocks,
          stockDetails: stockDetails,
        },
      })
      .pipe(
        map((item) =>
          item ? item.data["insert_event_sponsor_stock"].affected_rows : 0
        )
      );
  }

  upsertEventInventory(inventories: EventInventoryUpload[]): Observable<any> {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.UpserteventInventoryQL,
        variables: {
          inventories: inventories,
        },
      })
      .pipe(
        map((item) => (item ? item.data["insert_inventory"].affected_rows : 0))
      );
  }

  deleteEventSponsorStockDetails(ids: string[]) {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.DeleteEventSponsorStockDetailQL,
        variables: {
          ids: ids,
        },
      })
      .pipe(map((result) => result.data));
  }

  deleteEventInventory(ids: string[]) {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.DeleteEventInventoryQL,
        variables: {
          ids: ids,
        },
      })
      .pipe(map((result) => result.data));
  }

  deleteEventElements(
    fieldsToDelete: number[],
    optionsToDelete: number[]
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<CustomFormElement>({
          mutation: Query.DeleteEventElementsQL,
          variables: {
            fieldsToDelete: fieldsToDelete,
            optionsToDelete: optionsToDelete,
            bulkdDeleteRequired: true,
          },
        })
        .subscribe(
          ({ data }) => {
            resolve(true);
          },
          (error) => {
            resolve(false);
            //console.log('Could not add due to ' + error);
          }
        );
    });
  }

  deleteEventSponsors(ids: string[], eventId: string) {
    return this.apollo
      .mutate<CustomFormElement>({
        mutation: Query.DeleteEventSponsorsQL,
        variables: {
          ids: ids,
          eventId: eventId,
        },
      })
      .pipe(map((result) => result.data));
  }
}
