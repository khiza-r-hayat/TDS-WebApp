import { Injectable } from "@angular/core";
import { CampaignService } from "./campaign.service";
import { EventService } from "./event.service";
import { UserSessionService } from "./session.service";
import { UserRole } from "../../classes/roles";

@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(
    private _sessionService: UserSessionService,
    private _eventService: EventService,
    private _campaignService: CampaignService
  ) {}

  getDashboradData() {
    const session = this._sessionService.session();
    const user = session.user;

    switch (user.roleId) {
      case UserRole.SUPER_ADMINISTRATOR:
      case UserRole.EVENT_ORGANIZER:
        return this._eventService.getEventsByTenantForDashboard(
          session.tenantId
        );
      default:
        return this._eventService.getDashboardCampaignEvent(
          session.tenantId,
          session.organizationId
        );
    }
  }
}
