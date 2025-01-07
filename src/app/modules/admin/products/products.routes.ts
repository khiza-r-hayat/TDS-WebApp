import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { ProductsComponent } from "./products.component";
import { ProductListComponent } from "./list/list.component";
import { ProductDetailComponent } from "./detail/detail.component";
import { ProductService } from "app/shared/core/domain/services/product.service";
import { brandsResolver } from "../brands/brand.resolver";
import { productResolver, productsResolver } from "./products.resolver";

/**
 * Can deactivate details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateDetails = (
  component: ProductDetailComponent,
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
  if (!nextState.url.includes("/products")) {
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
    component: ProductsComponent,
    children: [
      {
        path: "",
        component: ProductListComponent,
        resolve: {
          brands: brandsResolver,
          products: productsResolver,
        },
        children: [
          {
            path: "add",
            component: ProductDetailComponent,
            canDeactivate: [canDeactivateDetails],
          },
          {
            path: ":id",
            component: ProductDetailComponent,
            resolve: {
              product: productResolver,
            },
            canDeactivate: [canDeactivateDetails],
          },
        ],
      },
    ],
  },
] as Routes;
