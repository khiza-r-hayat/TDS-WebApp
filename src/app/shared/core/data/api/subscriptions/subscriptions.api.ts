import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Apollo } from 'apollo-angular';
import { UserApprovalModel } from 'app/shared/core/domain/models/brand.model';
import { SubscriptionsRepository } from 'app/shared/core/domain/repository/subscription.repository';
import * as Query from 'app/shared/core/graphql/subscriptions.gql';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionsAPI implements SubscriptionsRepository {
    private apollo = inject(Apollo);

    getSubscriptionsAndPlans(): Observable<any> {
        return this.apollo.subscribe<any>({
            query: Query.GetSubscriptionsAndPlansQL,
        });
    }

    getUserApprovalRequest(userId: string): Observable<any> {
        return this.apollo
            .subscribe<any>({
                query: Query.GetUserApprovalRequestQL,
                variables: {
                    userId: userId,
                },
            })
            .pipe(map((result) => result.data['approval_request']));
    }

    upsertApprovalRequest(rqst: UserApprovalModel[]): Observable<any> {
        return this.apollo.mutate<UserApprovalModel[]>({
            mutation: Query.UpsertApprovalRequestQL,
            variables: {
                rqst: rqst,
            },
        });
    }
}
