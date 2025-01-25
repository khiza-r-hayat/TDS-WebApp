import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { LocalStorageService } from "app/shared/core/domain/services/local_storage.service";
import { ShipmentService } from "app/shared/core/domain/services/shipment.service";
import { SubscriptionService } from "app/shared/core/domain/services/subscription.service";
import { environment } from "environments/environment";
import { catchError, throwError } from "rxjs";

export const subscriptionTypesAndPlansResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(SubscriptionService);
    const localStorage = inject(LocalStorageService);
    const router = inject(Router);
    const user = localStorage.get(environment.sessionKey).user;

    //TODO: make sure that this function compansates sponsor

    return service.getSubscriptionsAndPlans().pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log(
                'Error fetching Subscription Types And Plans!',
                error
            );

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

export const userApprovalRequestResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(SubscriptionService);
    const localStorage = inject(LocalStorageService);
    const router = inject(Router);
    const user = localStorage.get(environment.sessionKey).user;

    //TODO: make sure that this function compansates sponsor

    return service.getUserApprovalRequest(user.id).pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log(
                'Error fetching Subscription Types And Plans!',
                error
            );

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};
