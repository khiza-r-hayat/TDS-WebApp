import {
  BrandModel,
  BrandUpload,
  Product,
  ProductModel,
  ProductUpload,
} from "../models/brand.model";

export class BrandHelper {
  public static generateBrandObject(
    brand: BrandUpload,
    products: ProductModel[]
  ): BrandModel {
    return {
      id: brand.id,
      name: brand.name,
      tenantId: brand.tenantId,
      status: brand.status,
      createdAt: new Date(),
      products: products,
    };
  }

  public static generateProductObject(product: ProductUpload): Product {
    return {
      id: product.id,
      name: product.name,
      brandId: product.brandId,
      status: product.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      brand: null,
    };
  }
}
