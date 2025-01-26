import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from 'app/shared/core/domain/services/local_storage.service';
import { ShipmentService } from 'app/shared/core/domain/services/shipment.service';
import { environment } from 'environments/environment';
import { catchError, throwError } from 'rxjs';

export const myShipmentsResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(ShipmentService);
    const localStorage = inject(LocalStorageService);
    const router = inject(Router);
    const user = localStorage.get(environment.sessionKey).user;

    //TODO: make sure that this function compansates sponsor

    return service.getShipmentByUserId(user.id).pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log(
                'Error fetching shipments with products by user id!',
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

export const shipmentResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(ShipmentService);
    const localStorage = inject(LocalStorageService);
    const router = inject(Router);
    const user = localStorage.get(environment.sessionKey).user;

    //TODO: make sure that this function compansates sponsor

    return service.getShipmentById(route.paramMap.get('id')).pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log(
                'Error fetching shipments with products by user id!',
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
