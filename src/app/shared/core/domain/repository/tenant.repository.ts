import { Observable } from "rxjs";
import { TenantTableModel, TenantUpload } from "../models/tenant.model";

export abstract class TenantRepository {
  abstract getTenants(): Observable<any[]>;
  abstract getTenantById(id: string): Observable<any>;
  abstract upsertTenants(accounts: TenantUpload[]): Observable<any>;
  abstract deleteTenants(accounts: string[]): Observable<any>;
}
