import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { AccountsComponent } from "app/modules/admin/accounts/accounts.component";
import { AccountDetailComponent } from "app/modules/admin/accounts/detail/detail.component";
import { accountsResolver, accountResolver } from "./account.resolver";
import { AccountListComponent } from "./list/list.component";

/**
 * Account resolver
 *
 * @param route
 * @param state
 */

/**
 * Can deactivate details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateDetails = (
  component: AccountDetailComponent,
  // currentRoute: ActivatedRouteSnapshot,
  // currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  // Get the next route
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  // If the next state doesn't contain '/accounts'
  // it means we are navigating away from the
  // accounts app
  if (!nextState.url.includes("/accounts")) {
    // Let it navigate
    return true;
  }

  // If we are navigating to new account...
  if (nextState.url.includes("/add")) {
    // Just navigate
    return true;
  }

  // If we are navigating to edit account...
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
    component: AccountsComponent,
    children: [
      {
        path: "",
        component: AccountListComponent,
        resolve: {
          accounts: accountsResolver,
        },
        children: [
          {
            path: "add",
            component: AccountDetailComponent,
            canDeactivate: [canDeactivateDetails],
          },
          {
            path: ":id",
            component: AccountDetailComponent,
            resolve: {
              account: accountResolver,
            },
            canDeactivate: [canDeactivateDetails],
          },
        ],
      },
    ],
  },
] as Routes;
