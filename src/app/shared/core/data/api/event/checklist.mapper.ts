import {
  ChecklistModel,
  ChecklistModelResponse,
} from "app/shared/core/domain/models/event.model";
import { Mapper } from "../../../base/mapper";

export class ChecklistMapper extends Mapper<
  ChecklistModelResponse,
  ChecklistModel
> {
  mapFrom(param: ChecklistModelResponse): ChecklistModel {
    return {
      id: param.id,
      tenantId: param.tenantId,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  mapTo(param: ChecklistModel): ChecklistModelResponse {
    return {
      id: param.id,
      tenantId: param.tenantId,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
