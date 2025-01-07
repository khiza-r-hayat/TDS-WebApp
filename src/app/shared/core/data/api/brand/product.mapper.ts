import { Mapper } from "../../../base/mapper";
import {
  ProductModel,
  ProductResponse,
} from "app/shared/core/domain/models/brand.model";

export class ProductMapper extends Mapper<ProductResponse, ProductModel> {
  mapFrom(param: ProductResponse): any {
    return {
      id: param.id,
      name: param.name,
      status: param.status,
      createdAt: param.createdAt,
    };
  }

  mapTo(param: ProductModel): ProductResponse {
    return {
      id: param.id,
      name: param.name,
      brandId: param.brandId,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
