import { Mapper } from "../../../base/mapper";
import { Roles } from "app/shared/core/domain/models/account.model";

export class RoleMapper extends Mapper<Roles, Roles> {
  mapFrom(param: Roles): any {
    return {
      id: param.id,
      name: param.name,
    };
  }

  mapTo(param: Roles): Roles {
    return {
      id: param.id,
      name: param.name,
    };
  }
}
