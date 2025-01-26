import { Observable } from "rxjs";
import { UserApprovalModel } from "../models/shipment.model";

export abstract class SubscriptionsRepository {
  abstract getSubscriptionsAndPlans(): Observable<any[]>;
  abstract getUserApprovalRequest(userId:string): Observable<any[]>;
  abstract upsertApprovalRequest(rqst:UserApprovalModel[]): Observable<UserApprovalModel[]>;
}
