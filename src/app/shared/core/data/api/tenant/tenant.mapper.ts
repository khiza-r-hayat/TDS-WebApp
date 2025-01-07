import { Mapper } from "../../../base/mapper";
import {
  Tenant,
  TenantForm,
  TenantUpload,
} from "app/shared/core/domain/models/tenant.model";

export class TenantMapper extends Mapper<any, any> {
  mapFrom(param: any): Tenant {
    return {
      id: param.id,
      title: param.title,
      logo: param.logo,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      createdBy: param.createdBy,
      subscriptions: param.subscriptions,
    };
  }

  mapTo(param: TenantForm): TenantUpload {
    return {
      id: param.id,
      title: param.title,
      logo: param.logo,
      createdBy: param.createdBy,
      subscriptions: {
        data: {
          planId: param.subscription.planId,
          startDate: param.subscription.startDate,
          endDate: param.subscription.endDate,
          isActive: param.subscription.isActive,
          type: param.subscription.type,
          createdBy: param.subscription.createdBy,
        },
      },
    };
  }
}
