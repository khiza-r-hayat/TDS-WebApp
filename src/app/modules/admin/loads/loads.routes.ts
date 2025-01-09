import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { LoadsComponent } from "./loads.component";
import { LoadListComponent } from "./list/list.component";
import { brandResolver, brandsResolver, myLoadsResolver } from "./loads.resolver";
import { LoadDetailComponent } from "./detail/detail.component";

export default [
  {
    path: "",
    component: LoadsComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: LoadListComponent,
        // resolve: {
        //   myLoads: myLoadsResolver,
        // },
      },
      {
        path: "add",
        component: LoadDetailComponent,
        // canDeactivate: [canDeactivateDetails],
      },
      {
        path: ":id",
        component: LoadDetailComponent,
        // resolve: {
        //   brand: brandResolver,
        // },
        // canDeactivate: [canDeactivateDetails],
      },
    ],
  },
] as Routes;
