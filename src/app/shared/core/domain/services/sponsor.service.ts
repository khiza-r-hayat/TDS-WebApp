import { inject, Injectable, signal } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { Tenant } from "../models/tenant.model";
import { LogService } from "app/shared/logs/log.service";
import { Sponsor, SponsorUpload } from "../models/sponsor.model";
import { MessageService } from "../../classes/message.service";
import { SponsorRepository } from "../repository/sponsor.repository";
import { SponsorHelper } from "../helpers/sponsor.helper";
import { FilterUtils } from "../../classes/filter_utils";

@Injectable({ providedIn: "root" })
export class SponsorService {
  // Private signals
  private _sponsor = signal<Sponsor | null>(null);
  private _sponsors = signal<Sponsor[]>([]);
  private _eventSponsors = signal<Sponsor[]>([]);

  private api = inject(SponsorRepository);
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
   * Getter for sponsor
   */
  get sponsor() {
    return this._sponsor;
  }
  /**
   * Getter for sponsors
   */
  get sponsors() {
    return this._sponsors;
  }

  get eventSponsors() {
    return this._eventSponsors;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Get methods
  // -----------------------------------------------------------------------------------------------------

  getSponsors(): Observable<Sponsor[]> {
    return this.api.getSponsors().pipe(
      catchError((e) => {
        console.log("Error fetching sponsors", e);
        this.messageService.errorMessage(`Failed to fetch sponsors!`);
        return of(null);
      }),
      tap((response: any) => {
        if (response) {
          console.log("Fetched sponsors successfuly!");
          this._sponsors.set(response);
        }
      })
    );
  }

  getSponsorById(id: string): Observable<Sponsor> {
    return this.api.getSponsorById(id).pipe(
      catchError((e) => {
        console.log("Error fetching sponsor", e, id);
        this.messageService.errorMessage(`Failed to fetch sponsor!`);
        return of(null);
      }),
      tap((response: Sponsor) => {
        if (response) {
          console.log("Fetched sponsor successfuly", id);
          this._sponsor.set(response[0]);
        }
      })
    );
  }

  getSponsorsByTenantId(id: string): Observable<Sponsor[]> {
    return this.api.getSponsorsByTenantId(id).pipe(
      catchError((e) => {
        console.log("Error fetching sponsors by tenantId", e, id);
        this.messageService.errorMessage(`Failed to fetch sponsors!`);
        return of(null);
      }),
      map((response: Sponsor[]) => {
        if (response) {
          console.log("Fetched sponsors by tenantId successfuly", id);
          this._sponsors.set(response);
        }
        return response;
      })
    );
  }

  //------------------------------------------------------
  // @ Filter Methods
  //------------------------------------------------------

  filterSponsors(query: string): Sponsor[] {
    return FilterUtils.filterArrayByQuery(this.sponsors(), query);
  }

  filterForEventSponsors(query: string): Sponsor[] {
    let sponsors = this.sponsors().filter(
      (s) => !this._eventSponsors().some((es) => es.id === s.id)
    );
    return FilterUtils.filterArrayByQuery(sponsors, query);
  }

  //------------------------------------------------------
  // @ Delete Methods
  //------------------------------------------------------

  removeSelectedSponsors(sponsors: Sponsor[]) {
    const ids = sponsors.map((s) => s.id);
    this.api
      .deleteSponsors(ids)
      .pipe(
        catchError((e) => {
          console.log("Error deleting sponsors", e, ids);
          this.messageService.errorMessage(
            `Failed to delete ${
              sponsors.length === 1 ? "sponsor" : "sponsors"
            }!`
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          console.log("Deleted sponsors successfuly", ids);
          const sponsorsFiltered = this._sponsors().filter(
            (v) => !sponsors.some((a) => a.id === v.id)
          );
          this._sponsors.set(sponsorsFiltered);
        }
      });
  }

  //------------------------------------------------------
  // @ Add/Upsert Methods
  //------------------------------------------------------

  upsertSponsors(sponsors: SponsorUpload[], tenant: Tenant): Observable<any> {
    return this.api.upsertSponsors(sponsors).pipe(
      catchError((e) => {
        console.log("Error uploading sponsors", e);
        this.messageService.errorMessage(
          `Failed to upload ${sponsors.length === 1 ? "sponsor" : "sponsors"}`
        );
        return of(null);
      }),
      tap((res: any) => {
        if (res) {
          console.log(
            `Added ${sponsors.length} ${
              sponsors.length === 1 ? "sponsor" : "sponsors"
            } successfully`
          );
          this.addSponsorsLocally(sponsors, tenant);
        }
      })
    );
  }

  //------------------------------------------------------
  // @ Local Update Methods
  //------------------------------------------------------

  /**
   * Event Sponsor Methods Start
   */

  addEventSponsors(ids: string[]) {
    const sponsors = this._sponsors().filter((s) =>
      ids.some((id) => id === s.id)
    );
    let update = [...this._eventSponsors(), ...sponsors];
    this._eventSponsors.set(update);
  }

  removeEventSponsors(sponsors: Sponsor[]) {
    let update = [...this._eventSponsors()];

    this._eventSponsors.set(
      update.filter((es) => !sponsors.some((s) => s.id === es.id))
    );
  }

  clearEventSponsor() {
    this._eventSponsors.set([]);
  }

  /**
   * Event Sponsor Methods End
   */

  addSponsorsLocally(sponsors: SponsorUpload[], tenant: Tenant) {
    let sponsorList: Sponsor[] = [...this.sponsors()];

    for (let sponsor of sponsors) {
      const index = sponsorList.findIndex((s) => s.id == sponsor.id);
      if (index !== -1) {
        sponsorList[index].title = sponsor.title;
      } else {
        sponsorList.push(SponsorHelper.generateSponsorObject(sponsor, tenant));
      }
    }

    this._sponsors.set(sponsorList);
  }
}
