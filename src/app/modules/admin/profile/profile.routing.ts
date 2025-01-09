import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AccountService } from 'app/shared/core/domain/services/account.service';


const profileResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(AccountService);
    const router = inject(Router);

    return service.getAccountById(route.paramMap.get('id')).pipe(
        // Error here means the requested contact is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error 
            return throwError(error);
        })
    );
};

export default [
    {
        path: ':id',
        component: ProfileComponent,
        resolve: {
            contact: profileResolver,
        },
    }
] as Routes;
