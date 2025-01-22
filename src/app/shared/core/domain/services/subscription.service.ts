import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { FilterUtils } from '../../classes/filter_utils';
import { MessageService } from '../../classes/message.service';
import { PlanMapper } from '../../data/api/tenant/plan.mapper';
import { TenantMapper } from '../../data/api/tenant/tenant.mapper';
import {
    Plan,
    Subscriptions,
    Tenant,
    TenantUpload,
} from '../models/tenant.model';
import { TenantRepository } from '../repository/tenant.repository';
import { SubscriptionsRepository } from '../repository/subscription.repository';
import { SubscriptionTypeMapper } from '../../data/api/subscriptions/subscription.mapper';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
    // Private signals
    private _plans = signal<Plan[] | null>(null);
    private _subscriptionTypes = signal<Plan[] | null>(null);
    private planMapper = new PlanMapper();
    private subscriptionTypeMapper = new SubscriptionTypeMapper();

    // private logger = inject(LogService);
    private api = inject(SubscriptionsRepository);
    private messageService = inject(MessageService);
    /**
     * Constructor
     *    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for tenant
     */
    get plans() {
        return this._plans;
    }

    /**
     * Getter for tenant
     */
    get subscriptionTypes() {
        return this._subscriptionTypes;
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Get methods
    // -----------------------------------------------------------------------------------------------------

    getSubscriptionsAndPlans(): Observable<Tenant[]> {
        return this.api.getSubscriptionsAndPlans().pipe(
            catchError((e) => {
                console.log('Error fetching Subscription Types And Plans', e);
                this.messageService.errorMessage(`Failed to fetch Subscription Types And Plans!`);
                return of(null);
            }),
            tap((response: any) => {
                if (response) {
                    console.log('Fetched Subscription Types And Plans successfuly');

                    const subTypes = response.data['subscription_type'].map((e) =>
                        this.subscriptionTypeMapper.mapFrom(e)
                    );
                    const plans = response.data['plans'].map((e) =>
                        this.planMapper.mapFrom(e)
                    );
                    this._subscriptionTypes.set(subTypes);
                    this._plans.set(plans);
                }
            })
        );
    }
  }
