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
        active: true,
    },
    {
        route: 'accounts',
        roles: [UserRole.SUPER_ADMINISTRATOR],
        active: true,
    },
    {
        route: 'shipments',
        roles: [UserRole.SUPER_ADMINISTRATOR, UserRole.SHIPMENT_ADMIN],
        active: true,
    },
    {
        route: 'reports',
        roles: [
            UserRole.SUPER_ADMINISTRATOR,
            UserRole.SHIPMENT_ADMIN,
            UserRole.OPERATOR_ADMIN,
        ],
        active: true,
    },
    {
        route: 'settings',
        roles: [
            UserRole.SUPER_ADMINISTRATOR,
            UserRole.SHIPMENT_ADMIN,
            UserRole.OPERATOR_ADMIN,
        ],
        active: true,
    },
    {
        route: 'example',
        roles: [],
        active: true,
    },
    {
        route: 'subscription',
        roles: [UserRole.InActive],
        active: true,
    },
    {
        route: 'profile',
        roles: [],
        active: true,
    },
    {
        route: 'redirect',
        roles: [],
        active: true,
    },
];

const userInitialRoutes = {
    [UserRole.SUPER_ADMINISTRATOR]: 'shipments',
    [UserRole.SHIPMENT_ADMIN]: 'shipments',
    [UserRole.InActive]: 'subscription',
};

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
    const path = route.routeConfig.path;

    if (path === '' || path === 'signed-in-redirect') {
        router.navigate([userInitialRoutes[roleId]]);
        return true;
    }

    const routeAccess = roleAcess.find(
        (a) => a.route === path
    );

    if (!routeAccess) {
        router.navigate(['/redirect/notfound']);
        return true;
    }

    if (routeAccess.active === false) {
        router.navigate(['/redirect/maintainance']);
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

