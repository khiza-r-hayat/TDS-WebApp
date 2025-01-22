import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { BrandService } from 'app/shared/core/domain/services/brand.service';
import { LocalStorageService } from 'app/shared/core/domain/services/local_storage.service';
import { UserSessionService } from 'app/shared/core/domain/services/session.service';
import { ShipmentService } from 'app/shared/core/domain/services/shipment.service';
import { environment } from 'environments/environment';
import { catchError, throwError } from 'rxjs';

export const brandResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(BrandService);
    // const logger = inject(LogService);
    const router = inject(Router);

    return service.getBrandById(route.paramMap.get('id')).pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log('Error fetching brand by id!', error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

export const brandsResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(BrandService);
    const sessionService = inject(UserSessionService);
    // const logger = inject(LogService);
    const router = inject(Router);
    const tenant = sessionService.session().tenantId;

    //TODO: make sure that this function compansates sponsor

    return service.getBrandWithoutProductByTenant(tenant).pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log(
                'Error fetching brands with products by tenant id!',
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

export const allShipmentsResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(ShipmentService);
    const localStorage = inject(LocalStorageService);
    const router = inject(Router);

    //TODO: make sure that this function compansates sponsor

    return service.getShipments().pipe(
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

export const brandsWithProductsResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const brandService = inject(BrandService);
    const sessionService = inject(UserSessionService);
    // const logger = inject(LogService);
    const tenant = sessionService.session().tenantId;

    return brandService.getBrandByTenant(tenant).pipe(
        // Error here means the requested tenant is not available
        catchError((error) => {
            // Log the error
            console.log('Error fetching brands by tenant!', error);
            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};
