import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { EventService } from "app/shared/core/domain/services/event.service";
import { UserSessionService } from "app/shared/core/domain/services/session.service";
import { LogService } from "app/shared/logs/log.service";
import { catchError, throwError } from "rxjs";

/**
 * Event resolver
 *
 * @param route
 * @param state
 */
export const eventResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const eventService = inject(EventService);
  const router = inject(Router);

  return eventService.getEventById(route.paramMap.get("id")).pipe(
    // Error here means the requested course is not available
    catchError((error) => {
      // Log the error
      console.error(error);

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};

/**
 * Event resolver
 *
 * @param route
 * @param state
 */
export const eventsResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const eventService = inject(EventService);
  const router = inject(Router);
  const sessionService = inject(UserSessionService);
  // const logger = inject(LogService);
  const tenant = sessionService.session().tenantId;

  return eventService.getEventByTenant(tenant).pipe(
    // Error here means the requested course is not available
    catchError((error) => {
      // Log the error
      console.log("Error fetching events by tenant!", error, tenant);

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};
