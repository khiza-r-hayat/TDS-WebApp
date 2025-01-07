import { Utility } from "../../classes/utility";
import { AccountModel } from "../models/account.model";
import { UserSessionUpload } from "../models/session.model";

export class SessionHelper {
  static createSession(
    user: AccountModel,
    impersonatedId?: string
  ): UserSessionUpload {
    return {
      id: Utility.generateUUID(),
      userId: user.id,
      expiresAt: Utility.getSessionExpiryTime(),
      impersonatedId: impersonatedId,
      organizationId: SessionHelper.getUserSessionDefaultOrganization(user),
      tenantId: SessionHelper.getUserSessionDefaultTenant(user),
    };
  }

  static getUserSessionDefaultOrganization(user: AccountModel) {
    return user.tenantRoles.length
      ? user.tenantRoles[0]?.tenantId ?? ""
      : user.companyRoles.length
      ? user.companyRoles[0]?.sponsorCompanyId ?? ""
      : user.campaignRoles.length
      ? user.campaignRoles[0]?.campaign?.sponsorId ?? ""
      : "";
  }

  static getUserSessionDefaultTenant(user: AccountModel): string {
    return user.tenantRoles.length
      ? user.tenantRoles[0]?.tenantId ?? ""
      : user.companyRoles.length
      ? user.companyRoles[0]?.sponsorCompany?.tenantId ?? ""
      : user.campaignRoles[0]?.campaign?.sponsor?.tenantId ?? "";
  }
}
