import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/subscriptions.gql";
import { TenantRepository } from "app/shared/core/domain/repository/tenant.repository";
import { TenantUpload } from "app/shared/core/domain/models/tenant.model";
import { SubscriptionsRepository } from "app/shared/core/domain/repository/subscription.repository";

@Injectable({
  providedIn: "root",
})
export class SubscriptionsAPI implements SubscriptionsRepository {
  private apollo = inject(Apollo);

  getSubscriptionsAndPlans(): Observable<any> {
    return this.apollo.subscribe<any>({
      query: Query.GetSubscriptionsAndPlansQL,
    });}
}
