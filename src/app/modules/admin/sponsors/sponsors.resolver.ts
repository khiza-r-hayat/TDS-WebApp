import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { EventService } from "app/shared/core/domain/services/event.service";
import { UserSessionService } from "app/shared/core/domain/services/session.service";
import { SponsorService } from "app/shared/core/domain/services/sponsor.service";
import { LogService } from "app/shared/logs/log.service";
import { catchError, throwError } from "rxjs";

export const sponsorByTenantResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const service = inject(SponsorService);
  const sessionService = inject(UserSessionService);
  // const logger = inject(LogService);
  const tenant = sessionService.session().tenantId;

  return service.getSponsorsByTenantId(tenant).pipe(
    // Error here means the requested tenant is not available
    catchError((error) => {
      // Log the error
      console.log("Error fetching sponsors by tenant!", error);

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};
