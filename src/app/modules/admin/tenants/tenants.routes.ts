import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { TenantService } from "app/shared/core/domain/services/tenant.service";
import { TenantListComponent } from "./list/list.component";
import { TenantDetailComponent } from "./detail/detail.component";
import { TenantsComponent } from "./tenants.component";
import { tenantResolver } from "./tenant.resolver";

/**
 * Can deactivate details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateDetails = (
  component: TenantDetailComponent,
  // currentRoute: ActivatedRouteSnapshot,
  // currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  // Get the next route
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  // If the next state doesn't contain '/tenants'
  // it means we are navigating away from the
  // tenants app
  if (!nextState.url.includes("/tenants")) {
    // Let it navigate
    return true;
  }

  // If we are navigating to new tenant...
  if (nextState.url.includes("/add")) {
    // Just navigate
    return true;
  }

  // If we are navigating to edit tenant...
  if (nextRoute.paramMap.get("id")) {
    // Just navigate
    return true;
  }

  // Otherwise, close the drawer first, and then navigate
  return component.closeDrawer().then(() => true);
};

export default [
  {
    path: "",
    component: TenantsComponent,
    children: [
      {
        path: "",
        component: TenantListComponent,
        resolve: {
          tenants: () => inject(TenantService).getTenants(),
        },
        children: [
          {
            path: "add",
            component: TenantDetailComponent,
            canDeactivate: [canDeactivateDetails],
          },
          {
            path: ":id",
            component: TenantDetailComponent,
            resolve: {
              tenant: tenantResolver,
            },
            canDeactivate: [canDeactivateDetails],
          },
        ],
      },
    ],
  },
] as Routes;
