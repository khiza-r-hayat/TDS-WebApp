import {
  UserSessionModel,
  UserSessionUpload,
} from "app/shared/core/domain/models/session.model";
import { Mapper } from "../../../base/mapper";

export class SessionMapper extends Mapper<UserSessionModel, UserSessionUpload> {
  mapFrom(param: UserSessionModel): any {
    return {
      id: param.id,
      userId: param.userId,
      createdAt: param.createdAt,
      expiresAt: param.expiresAt,
      impersonatedId: param.impersonatedId,
      organizationId: param.organizationId,
      tenantId: param.tenantId,
      impersonatedAs: param.impersonatedAs,
      user: param.user,
    };
  }

  mapTo(param: UserSessionUpload): UserSessionModel {
    return {
      id: param.id,
      userId: param.userId,
      createdAt: new Date(),
      expiresAt: param.expiresAt,
      tenantId: param.tenantId,
      impersonatedId: param.impersonatedId,
      organizationId: param.organizationId,
    };
  }
}
