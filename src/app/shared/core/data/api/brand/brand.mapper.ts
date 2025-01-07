import { Mapper } from "../../../base/mapper";
import {
  BrandModel,
  BrandResponse,
} from "app/shared/core/domain/models/brand.model";

export class BrandMapper extends Mapper<BrandResponse, BrandModel> {
  mapFrom(param: BrandResponse): any {
    return {
      id: param.id,
      tenantId: param.tenantId,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
      products: param.products,
    };
  }

  mapTo(param: BrandModel): BrandResponse {
    return {
      id: param.id,
      tenantId: param.tenantId,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
      products: param.products,
    };
  }
}
