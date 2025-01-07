import { Observable } from "rxjs";
import { BrandModel, BrandUpload, ProductModel } from "../models/brand.model";

export abstract class BrandRepository {
  abstract getBrandByTenant(id: string): Observable<any[]>;
  abstract getBrandWithoutProductByTenant(id: string): Observable<any[]>;
  abstract getBrandById(id: string): Observable<BrandModel>;
  abstract getProductByIdIn(ids: string[]): Observable<ProductModel[]>;
  abstract deleteBrands(ids: string[]): Observable<any>;
  abstract upsertBrands(brands: BrandUpload[]): Observable<any>;
}
