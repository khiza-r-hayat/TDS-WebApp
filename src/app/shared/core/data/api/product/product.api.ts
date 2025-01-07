import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/product.gql";
import {
  ProductModel,
  ProductUpload,
} from "app/shared/core/domain/models/brand.model";
import { ProductMapper } from "./product.mapper";
import { ProductRepository } from "app/shared/core/domain/repository/product.repository";

@Injectable({
  providedIn: "root",
})
export class ProductAPI implements ProductRepository {
  private apollo = inject(Apollo);
  mapper = new ProductMapper();

  getProducts(): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getProductsQL,
        // variables: {
        //   id: id,
        // },
      })
      .pipe(
        map((result) => result.data["product"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getProductsByBrand(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getProductsByBrandQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["product"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getProductById(id: string): Observable<ProductModel> {
    return this.apollo
      .subscribe<ProductModel>({
        query: Query.getProductByIdQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["product"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  deleteProducts(ids: string[]): Observable<ProductModel> {
    return this.apollo
      .mutate<ProductModel>({
        mutation: Query.deleteProductsQL,
        variables: {
          ids: ids,
        },
      })
      .pipe(map((result) => result.data));
  }

  upsertProducts(products: ProductUpload[]): Observable<any> {
    return this.apollo.mutate<ProductUpload>({
      mutation: Query.upsertProductsQL,
      variables: {
        products: products,
      },
    });
  }
}
