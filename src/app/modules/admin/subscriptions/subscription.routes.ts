import { Inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SubscriptionService } from 'app/shared/core/domain/services/subscription.service';
import { SubscriptionsComponent } from './subscription.component';
import { subscriptionTypesAndPlansResolver } from './subscription.resolver';

export default [
    {
        path: '',
        component: SubscriptionsComponent,
        resolve: {
            data: subscriptionTypesAndPlansResolver,
        },
    },
] as Routes;
