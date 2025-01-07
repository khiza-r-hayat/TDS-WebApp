import { Mapper } from "../../../base/mapper";
import {
  UserModel,
  UserResponse,
} from "app/shared/core/domain/models/account.model";

export class UserMapper extends Mapper<UserResponse, UserModel> {
  mapFrom(param: UserResponse): UserModel {
    return {
      id: param.id,
      title:param.title,
      email: param.email,
      phone: param.phone,
      photo: param.photo,
      active: param.active,
      isSuperAdmin: param.isSuperAdmin,
      roleId: param.roleId,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      createdBy: param.createdBy,
      role: param.role,
    };
  }

  mapTo(param: UserModel): UserResponse {
    return {
        id:param.id,
        title:param.title,
        email: param.email,
        phone: param.phone,
        photo: param.photo,
        active: param.active,
        isSuperAdmin: param.isSuperAdmin,
        roleId: param.roleId,
        createdAt: param.createdAt,
        updatedAt: param.updatedAt,
        createdBy: param.createdBy,
        role: param.role,
    };
  }
}
