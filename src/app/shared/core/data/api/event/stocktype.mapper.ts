import {
  StockTypeModelResponse,
  StockTypeModel,
} from "app/shared/core/domain/models/event.model";
import { Mapper } from "../../../base/mapper";

export class StockTypeMapper extends Mapper<
  StockTypeModel,
  StockTypeModelResponse
> {
  mapFrom(param: StockTypeModelResponse): StockTypeModel {
    return {
      id: param.id,
      tenantId: param.tenantId,
      name: param.name,
      hasExpiry: param.hasExpiry,
      hasBatchCode: param.hasBatchCode,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  mapTo(param: StockTypeModel): StockTypeModelResponse {
    return {
      id: param.id,
      tenantId: param.tenantId,
      name: param.name,
      hasExpiry: param.hasExpiry,
      hasBatchCode: param.hasBatchCode,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
