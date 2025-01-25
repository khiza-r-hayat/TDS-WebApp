import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { MessageService } from '../../classes/message.service';
import { SubscriptionTypeMapper } from '../../data/api/subscriptions/subscription.mapper';
import { PlanMapper } from '../../data/api/tenant/plan.mapper';
import { Role } from '../models/account.model';
import { Plan, Tenant } from '../models/tenant.model';
import { SubscriptionsRepository } from '../repository/subscription.repository';
import { UserApprovalModel } from '../models/brand.model';
import { map } from 'lodash';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
    // Private signals
    private _plans = signal<Plan[]>([]);
    private _userApprovalRequests = signal<UserApprovalModel[]>([]);
    private _roles = signal<Role[]>([]);
    private _subscriptionTypes = signal<Plan[]>([]);
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
     * Getter for plans
     */
    get plans() {
        return this._plans;
    }
    /**
     * Getter for plans
     */
    get userApprovalRequests() {
        return this._userApprovalRequests;
    }
    
    /**
     * Getter for roles
     */
    get roles() {
        return this._roles;
    }

    /**
     * Getter for subscriptions
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
                this.messageService.errorMessage(
                    `Failed to fetch Subscription Types And Plans!`
                );
                return of(null);
            }),
            tap((response: any) => {
                if (response) {
                    // console.log('Fetched Subscription Types And Plans successfuly');

                    const subTypes = response.data['subscription_type'].map(
                        (e) => this.subscriptionTypeMapper.mapFrom(e)
                    );
                    const plans = response.data['plans'].map((e) =>
                        this.planMapper.mapFrom(e)
                    );
                    const roles = response.data['roles'].map((e) => ({
                        id: e.id,
                        title: e.title,
                    }));
                    this._subscriptionTypes.set(subTypes);
                    this._plans.set(plans);
                    this._roles.set(roles);
                }
            })
        );
    }
    
    getUserApprovalRequest(userId:string): Observable<Tenant[]> {
        return this.api.getUserApprovalRequest(userId).pipe(
            catchError((e) => {
                console.log('Error fetching User approval request', e);
                this.messageService.errorMessage(
                    `Failed fetching User approval request!`
                );
                return of(null);
            }),
            tap((response: any) => {
                if (response) {
                    this.userApprovalRequests.set(response);
                }
            })
        );
    }
    
    upsertApprovalRequest(rqst:UserApprovalModel[]): Observable<UserApprovalModel[]> {
        return this.api.upsertApprovalRequest(rqst).pipe(
            catchError((e) => {
                console.log('Error submitting approval request, please try latter', e);
                this.messageService.errorMessage(
                    `Failed submitting approval request, please try latter!`
                );
                return of(null);
            })
        );
    }
}
