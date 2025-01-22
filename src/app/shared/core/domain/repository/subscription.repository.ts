import { Observable } from "rxjs";
import { TenantTableModel, TenantUpload } from "../models/tenant.model";

export abstract class SubscriptionsRepository {
  abstract getSubscriptionsAndPlans(): Observable<any[]>;
}
