import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { TenantService } from "app/shared/core/domain/services/tenant.service";
import { catchError } from "rxjs";
import { throwError } from "rxjs/internal/observable/throwError";

export const tenantResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tenantService = inject(TenantService);
  const router = inject(Router);

  return tenantService.getTenantById(route.paramMap.get("id")).pipe(
    // Error here means the requested tenant is not available
    catchError((error) => {
      // Log the error

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};
