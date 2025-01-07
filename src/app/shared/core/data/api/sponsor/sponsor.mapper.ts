import {
  Sponsor,
  SponsorUpload,
} from "app/shared/core/domain/models/sponsor.model";
import { Mapper } from "../../../base/mapper";

export class SponsorMapper extends Mapper<any, any> {
  mapFrom(param: any): Sponsor {
    return {
      id: param.id,
      title: param.title,
      logo: param.logo,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      createdBy: param.createdBy,
      tenantId: param.tenantId,
      tenant: param.tenant,
    };
  }

  mapTo(param: SponsorUpload): SponsorUpload {
    return {
      id: param.id,
      tenantId: param.tenantId,
      title: param.title,
      logo: param.logo,
      createdBy: param.createdBy,
    };
  }
}
