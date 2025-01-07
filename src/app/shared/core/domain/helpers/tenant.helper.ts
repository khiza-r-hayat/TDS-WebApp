import { Utility } from "../../classes/utility";
import { Subscriptions, TenantForm } from "../models/tenant.model";

export class TenantHelper {
  public static generateTenantUpload(
    param,
    userId: string,
    tenantId: string
  ): TenantForm {
    return {
      id: tenantId,
      title: param.title,
      logo: param.logo ?? "",
      createdBy: userId,
      subscription: {
        planId: param.subscription,
        startDate: param.startDate,
        endDate: param.endDate,
        isActive: param.status === "0",
        type: param.subsType,
        createdBy: userId,
      },
    };
  }

  public static getTenantSubScription(
    subscriptions: Subscriptions[]
  ): Subscriptions {
    let sub = subscriptions.find((s) => s.isActive);
    if (!sub) {
      sub = Utility.getLatestDateObject(subscriptions);
    }
    return sub;
  }
}
