import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { UserRole } from 'app/shared/core/classes/roles';
import { AccountModel } from 'app/shared/core/domain/models/account.model';
import { AccountService } from 'app/shared/core/domain/services/account.service';
import { UserSessionService } from 'app/shared/core/domain/services/session.service';
import { LogService } from 'app/shared/logs/log.service';
import { Observable, catchError, throwError } from 'rxjs';

export const accountResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const accountService = inject(AccountService);
    // const logger = inject(LogService);
    const router = inject(Router);

    return accountService.getAccountById(route.paramMap.get('id')).pipe(
        // Error here means the requested account is not available
        catchError((error) => {
            // Log the error
            console.log(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

// export const sponsorStaffResolver = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
// ) => {
//     const session = inject(UserSessionService);
//     const service = inject(AccountService);
//     const router = inject(Router);

//     return service
//         .getAccountsBySponsorAndRole(session.session().organizationId, [
//             UserRole.SUPERVISOR,
//             UserRole.BOOTH_PERSONNEL,
//         ])
//         .pipe(
//             // Error here means the requested course is not available
//             catchError((error) => {
//                 // Log the error
//                 console.error(error);

//                 // Get the parent url
//                 const parentUrl = state.url.split('/').slice(0, -1).join('/');

//                 // Navigate to there
//                 router.navigateByUrl(parentUrl);

//                 // Throw an error
//                 return throwError(error);
//             })
//         );
// };

export const accountsResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const accountService = inject(AccountService);
    // const sessionService = inject(UserSessionService);
    // const logger = inject(LogService);
    const router = inject(Router);

    // const session = sessionService.userSession();

    // let apiCall: Observable<AccountModel[]>;

    // switch (session.user.roleId) {
    //     case UserRole.SUPER_ADMINISTRATOR:
    //         {
    //             apiCall = accountService.getAccountsByRoles([
    //                 UserRole.SUPER_ADMINISTRATOR,
    //                 UserRole.EVENT_ORGANIZER,
    //             ]);
    //         }
    //         break;
    //     case UserRole.EVENT_ORGANIZER:
    //       {
    //         apiCall = accountService.getAccountsByTenantId(session.tenantId);
    //       }
    //       break;
    //     default: {
    //       apiCall = accountService.getAccountsBySponsorId(session.organizationId);
    //     }
    // }

    return accountService
        .getAccounts()
        .pipe(
            // Error here means the requested account is not available
            catchError((error) => {
                // Log the error
                console.log(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            })
        );
};
