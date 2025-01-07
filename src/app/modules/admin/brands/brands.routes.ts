import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { BrandDetailComponent } from "./detail/detail.component";
import { BrandsComponent } from "./brands.component";
import { BrandListComponent } from "./list/list.component";
import { brandResolver, brandsResolver, myLoadsResolver } from "./brand.resolver";

/**
 * Can deactivate details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateDetails = (
  component: BrandDetailComponent,
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
  if (!nextState.url.includes("/brands")) {
    // Let it navigate
    return true;
  }

  // If we are navigating to new sponsors...
  if (nextState.url.includes("/add")) {
    // Just navigate
    return true;
  }

  // If we are navigating to edit sponsors...
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
    component: BrandsComponent,
    children: [
      {
        path: "",
        component: BrandListComponent,
        // resolve: {
        //   myLoads: myLoadsResolver,
        // },
        children: [
          {
            path: "add",
            component: BrandDetailComponent,
            canDeactivate: [canDeactivateDetails],
          },
          {
            path: ":id",
            component: BrandDetailComponent,
            // resolve: {
            //   brand: brandResolver,
            // },
            canDeactivate: [canDeactivateDetails],
          },
        ],
      },
    ],
  },
] as Routes;
