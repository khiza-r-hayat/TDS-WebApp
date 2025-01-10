import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { User } from './core/user/user.types';
import { UserRole } from './shared/core/classes/roles';
import { LocalStorageService } from './shared/core/domain/services/local_storage.service';

const roleAcess = [
    {
        route: 'dashboard',
        roles: [
            UserRole.SUPER_ADMINISTRATOR,
            UserRole.SHIPMENT_ADMIN,
            UserRole.OPERATOR_ADMIN,
        ],
    },
    {
        route: 'accounts',
        roles: [UserRole.SUPER_ADMINISTRATOR],
    },
    {
        route: 'reports',
        roles: [
            UserRole.SUPER_ADMINISTRATOR,
            UserRole.SHIPMENT_ADMIN,
            UserRole.OPERATOR_ADMIN,
        ],
    },
    {
        route: 'settings',
        roles: [
            UserRole.SUPER_ADMINISTRATOR,
            UserRole.SHIPMENT_ADMIN,
            UserRole.OPERATOR_ADMIN,
        ],
    },
    {
        route: 'redirect',
        roles: [],
    },
];

export const RouteGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state
) => {
    const router: Router = inject(Router);
    const localStorage: LocalStorageService = inject(LocalStorageService);

    const user: User = localStorage.get(environment.sessionKey).user;

    if (!user) {
        router.navigate(['/redirect/unauthorized']);
        return false;
    }

    const roleId = user.roleId;

    const routeAccess = roleAcess.find(
        (a) => a.route === route.routeConfig.path
    );

    if (!routeAccess) {
        router.navigate(['/example']);
        return true;
    }
    const hasAccess = routeAccess
        ? routeAccess.roles.length === 0
            ? true
            : routeAccess.roles.includes(roleId)
        : false;

    if (!hasAccess) {
        router.navigate(['/redirect/unauthorized']);
    }

    return hasAccess;
};
