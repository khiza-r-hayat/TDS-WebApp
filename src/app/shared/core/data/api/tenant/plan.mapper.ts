import { Plan } from "app/shared/core/domain/models/tenant.model";
import { Mapper } from "../../../base/mapper";

export class PlanMapper extends Mapper<Plan, Plan> {
  mapFrom(param: Plan): any {
    return {
      id: param.id,
      name: param.name,
      title:param.title,
    };
  }

  mapTo(param: Plan): Plan {
    return {
      id: param.id,
      name: param.name,
      title:param.title,
    };
  }
}
