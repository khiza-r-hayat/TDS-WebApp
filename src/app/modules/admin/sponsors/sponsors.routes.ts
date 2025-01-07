import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { SponsorDetailComponent } from "./detail/detail.component";
import { SponsorListComponent } from "./list/list.component";
import { SponsorsComponent } from "./sponsors.component";
import { SponsorService } from "app/shared/core/domain/services/sponsor.service";
import { sponsorByTenantResolver } from "./sponsors.resolver";

/**
 * Can deactivate details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateDetails = (
  component: SponsorDetailComponent,
  // currentRoute: ActivatedRouteSnapshot,
  // currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  // Get the next route
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  // If the next state doesn't contain '/sponsors'
  // it means we are navigating away from the
  // sponsors app
  if (!nextState.url.includes("/sponsors")) {
    // Let it navigate
    return true;
  }

  // If we are navigating to new sponsors...
  if (nextState.url.includes("/add")) {
    // Just navigate
    return true;
  }

  // If we are navigating to edit sponsors...
  //   if (nextRoute.paramMap.get("id")) {
  //     // Just navigate
  //     return true;
  //   }

  // Otherwise, close the drawer first, and then navigate
  return component.closeDrawer().then(() => true);
};

export default [
  {
    path: "",
    component: SponsorsComponent,
    children: [
      {
        path: "",
        component: SponsorListComponent,
        resolve: {
          sponsors: sponsorByTenantResolver,
        },
        children: [
          {
            path: "add",
            component: SponsorDetailComponent,
            canDeactivate: [canDeactivateDetails],
          },
          //   {
          //     path: ":id",
          //     component: SponsorDetailComponent,
          //     resolve: {
          //       contact: tenantResolver,
          //     },
          //     canDeactivate: [canDeactivateContactsDetails],
          //   },
        ],
      },
    ],
  },
] as Routes;
