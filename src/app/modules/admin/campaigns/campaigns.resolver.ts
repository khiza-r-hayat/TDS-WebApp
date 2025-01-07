import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { CampaignService } from "app/shared/core/domain/services/campaign.service";
import { UserSessionService } from "app/shared/core/domain/services/session.service";
import { LogService } from "app/shared/logs/log.service";
import { catchError, throwError } from "rxjs";

export const CampaignsResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const campaignService = inject(CampaignService);
  const sessionService = inject(UserSessionService);
  // const logger = inject(LogService);
  const orgId = sessionService.session().organizationId;

  return campaignService.getSponsorCampaigns(orgId).pipe(
    // Error here means the requested course is not available
    catchError((error) => {
      // Log the error
      console.log("Error fetching campaigns by sponsor!", error, orgId);

      // Get the parent url
      const parentUrl = state.url.split("/").slice(0, -1).join("/");

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    })
  );
};
