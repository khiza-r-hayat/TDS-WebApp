import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { ProductService } from "app/shared/core/domain/services/product.service";
import { LogService } from "app/shared/logs/log.service";
import { catchError, throwError } from "rxjs";

export const productResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const service = inject(ProductService);
  // const logger = inject(LogService);
  const router = inject(Router);

  return service.getProductById(route.paramMap.get("id")).pipe(
    // Error here means the requested account is not available
    catchError((error) => {
      // Log the error
      console.log(error);

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};

export const productsResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const service = inject(ProductService);
  // const logger = inject(LogService);
  const router = inject(Router);

  return service.getProducts().pipe(
    // Error here means the requested account is not available
    catchError((error) => {
      // Log the error
      console.log(error);

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};
