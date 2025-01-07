import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import {
  Plan,
  Tenant,
  TenantUpload,
  Subscriptions,
} from "../models/tenant.model";
import { TenantMapper } from "../../data/api/tenant/tenant.mapper";
import { LogService } from "app/shared/logs/log.service";
import { PlanMapper } from "../../data/api/tenant/plan.mapper";
import { MessageService } from "../../classes/message.service";
import { TenantRepository } from "../repository/tenant.repository";
import { FilterUtils } from "../../classes/filter_utils";

@Injectable({ providedIn: "root" })
export class TenantService {
  // Private signals
  private _tenant = signal<Tenant | null>(null);
  private _tenants = signal<Tenant[] | null>(null);
  private _plans = signal<Plan[] | null>(null);

  private api = inject(TenantRepository);
  // private logger = inject(LogService);
  private messageService = inject(MessageService);
  private tenantMapper = new TenantMapper();
  private planMapper = new PlanMapper();
  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for tenant
   */
  get tenant() {
    return this._tenant;
  }

  /**
   * Getter for tenant
   */
  get plans() {
    return this._plans;
  }

  /**
   * Getter for tenants
   */
  get tenants() {
    return this._tenants;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Get methods
  // -----------------------------------------------------------------------------------------------------

  getTenants(): Observable<Tenant[]> {
    return this.api.getTenants().pipe(
      catchError((e) => {
        console.log("Error fetching tenants", e);
        this.messageService.errorMessage(`Failed to fetch tenants!`);
        return of(null);
      }),
      tap((response: any) => {
        if (response) {
          console.log("Fetched tenants successfuly");

          const tenants = response.data["tenants"].map((e) =>
            this.tenantMapper.mapFrom(e)
          );
          const plans = response.data["plans"].map((e) =>
            this.planMapper.mapFrom(e)
          );
          this._tenants.set(tenants);
          this._plans.set(plans);
        }
      })
    );
  }

  getTenantById(id: string): Observable<Tenant> {
    return this.api.getTenantById(id).pipe(
      catchError((e) => {
        console.log("Error fetching tenant", e, id);
        this.messageService.errorMessage(`Failed to fetch tenant!`);
        return of(null);
      }),
      tap((response: Tenant) => {
        if (response) {
          console.log("Fetched tenant successfuly", id);
          this._tenant.set(response[0]);
        }
      })
    );
  }

  //------------------------------------------------------
  // Filter Methods
  //------------------------------------------------------

  filterTenants(query: string): Tenant[] {
    return FilterUtils.filterArrayByQuery(this.tenants(), query);
  }

  //------------------------------------------------------
  // @ Delete Methods
  //------------------------------------------------------

  removeSelectedTenants(tenants: Tenant[]) {
    const ids = tenants.map((t) => t.id);
    this.api
      .deleteTenants(ids)
      .pipe(
        catchError((e) => {
          console.log("Error deleting tenants!", e);
          this.messageService.errorMessage(
            `Failed to delete ${tenants.length === 1 ? "tenant" : "tenants"}!`
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          console.log("deleted tenants successfuly!", ids);

          const tenantsFiltered = this._tenants().filter(
            (v) => !ids.some((a) => a === v.id)
          );

          this._tenants.set(tenantsFiltered);
        }
      });
  }

  //------------------------------------------------------
  // @ Add/Upsert Methods
  //------------------------------------------------------

  upsertTenants(tenants: TenantUpload[]): Observable<any> {
    return this.api.upsertTenants(tenants).pipe(
      catchError((e) => {
        console.log("Error uploading tenants", e);
        this.messageService.errorMessage(
          `Failed to upload ${tenants.length === 1 ? "tenant" : "tenants"}!`
        );
        return of(null);
      }),
      tap((res: any) => {
        if (res) {
          console.log(
            `Added ${tenants.length} ${
              tenants.length === 1 ? "tenant" : "tenants"
            } successfuly`
          );
          this.addTenantLocally(tenants);
        }
      })
    );
  }

  generateSubscription(t: TenantUpload): Subscriptions {
    return {
      tenantId: t.id,
      planId: t.subscriptions.data.planId,
      startDate: t.subscriptions.data.startDate,
      endDate: t.subscriptions.data.endDate,
      isActive: t.subscriptions.data.isActive,
      type: t.subscriptions.data.type,
      createdBy: t.subscriptions.data.createdBy,
      createdAt: new Date(),
      plan: {
        id: t.subscriptions.data.planId,
        name: this.plans().find((p) => p.id === t.subscriptions.data.planId)
          .name,
      },
    };
  }

  generateTenant(t: TenantUpload): Tenant {
    return {
      id: t.id,
      title: t.title,
      logo: t.logo,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: t.createdBy,
      subscriptions: [this.generateSubscription(t)],
    };
  }

  addTenantLocally(tenants: TenantUpload[]) {
    let tenantList = [...this.tenants()];
    for (let i = 0; i < tenants.length; i++) {
      let t = tenants[i];
      const index = tenantList.findIndex((v) => v.id === t.id);
      let tenantUpdate: Tenant = this.generateTenant(t);
      if (index !== -1) {
        tenantList[index] = tenantUpdate;
      } else {
        tenantList.push(tenantUpdate);
      }
    }
    this._tenants.set(tenantList);
  }
}
