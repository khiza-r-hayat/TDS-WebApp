import { Plan, SubscriptionType } from "app/shared/core/domain/models/tenant.model";
import { Mapper } from "../../../base/mapper";

export class SubscriptionTypeMapper extends Mapper<SubscriptionType, SubscriptionType> {
  mapFrom(param: SubscriptionType): SubscriptionType {
    return {
      id: param.id,
      title: param.title,
      days: param.days,
    };
  }

  mapTo(param: SubscriptionType): SubscriptionType {
    return {
      id: param.id,
      title: param.title,
      days: param.days,
    };
  }
}
