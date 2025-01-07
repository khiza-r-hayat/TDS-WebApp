import { Observable } from "rxjs";
import { ProductModel, ProductUpload } from "../models/brand.model";

export abstract class ProductRepository {
  abstract getProducts(): Observable<any[]>;
  abstract getProductsByBrand(id: string): Observable<any[]>;
  abstract getProductById(id: string): Observable<ProductModel>;
  abstract deleteProducts(ids: string[]): Observable<any>;
  abstract upsertProducts(products: ProductUpload[]): Observable<any>;
}
