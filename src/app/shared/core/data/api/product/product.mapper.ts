import { Mapper } from "../../../base/mapper";
import {
  Product,
  ProductResponse,
} from "app/shared/core/domain/models/brand.model";

export class ProductMapper extends Mapper<ProductResponse, Product> {
  mapFrom(param: Product): any {
    return {
      id: param.id,
      brandId: param.brandId,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      brand: param.brand,
    };
  }

  mapTo(param: Product): ProductResponse {
    return {
      id: param.id,
      brandId: param.brandId,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
