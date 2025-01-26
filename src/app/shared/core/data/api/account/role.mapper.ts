import { Mapper } from "../../../base/mapper";
import { Role } from "app/shared/core/domain/models/account.model";

export class RoleMapper extends Mapper<Role, Role> {
  mapFrom(param: Role): Role {
    return {
      id: param.id,
      title: param.title,
    };
  }

  mapTo(param: Role): Role {
    return {
      id: param.id,
      title: param.title,
    };
  }
}
