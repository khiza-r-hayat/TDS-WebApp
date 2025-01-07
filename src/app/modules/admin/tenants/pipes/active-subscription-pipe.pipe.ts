import { Pipe, PipeTransform } from "@angular/core";
import { Utility } from "app/shared/core/classes/utility";
import { TenantHelper } from "app/shared/core/domain/helpers/tenant.helper";
import { Subscriptions } from "app/shared/core/domain/models/tenant.model";

@Pipe({
  name: "activeSubscriptionPipe",
  standalone: true,
})
export class ActiveSubscriptionPipePipe implements PipeTransform {
  transform(list: Subscriptions[], key: string): any {
    const sub = TenantHelper.getTenantSubScription(list);

    let data;

    if (sub) {
      switch (key) {
        case "plan":
          {
            data = sub.plan.name;
          }
          break;
        case "startDate":
          {
            data = sub.startDate;
          }
          break;
        case "endDate":
          {
            data = sub.endDate;
          }
          break;
        case "type":
          {
            data = sub.type;
          }
          break;
        case "isActive":
          {
            data = sub.isActive ? "Active" : "Disabled";
          }
          break;
        case "color":
          {
            data = sub.isActive
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800";
          }
          break;
      }
    }
    return data ?? "";
  }
}
