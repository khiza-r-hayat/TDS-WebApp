import { Observable } from "rxjs";
import { TenantTableModel, TenantUpload } from "../models/tenant.model";
import { UserApprovalModel } from "../models/brand.model";

export abstract class SubscriptionsRepository {
  abstract getSubscriptionsAndPlans(): Observable<any[]>;
  abstract getUserApprovalRequest(userId:string): Observable<any[]>;
  abstract upsertApprovalRequest(rqst:UserApprovalModel[]): Observable<UserApprovalModel[]>;
}
