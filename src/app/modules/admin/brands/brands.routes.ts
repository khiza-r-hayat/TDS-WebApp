import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { BrandsComponent } from "./brands.component";
import { BrandListComponent } from "./list/list.component";
import { brandResolver, brandsResolver, myLoadsResolver } from "./brand.resolver";
import { BrandDetailComponent } from "./detail/detail.component";

export default [
  {
    path: "",
    component: BrandsComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: BrandListComponent,
        // resolve: {
        //   myLoads: myLoadsResolver,
        // },
      },
      {
        path: "add",
        component: BrandDetailComponent,
        // canDeactivate: [canDeactivateDetails],
      },
      {
        path: ":id",
        component: BrandDetailComponent,
        // resolve: {
        //   brand: brandResolver,
        // },
        // canDeactivate: [canDeactivateDetails],
      },
    ],
  },
] as Routes;
