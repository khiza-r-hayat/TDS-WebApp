import { inject, Injectable } from "@angular/core";
import { Observable, pipe, from, concatMap } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/brand.gql";
import { BrandRepository } from "app/shared/core/domain/repository/brand.repository";
import { BrandMapper } from "./brand.mapper";
import {
  BrandModel,
  BrandUpload,
  ProductModel,
} from "app/shared/core/domain/models/brand.model";
import { ProductMapper } from "./product.mapper";

@Injectable({
  providedIn: "root",
})
export class BrandAPI implements BrandRepository {
  private apollo = inject(Apollo);
  mapper = new BrandMapper();
  productMapper = new ProductMapper();

  getBrandByTenant(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getTenantBrandQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["brand"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getBrandWithoutProductByTenant(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getTenantBrandWithoutProductsQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["brand"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getBrandById(id: string): Observable<BrandModel> {
    return this.apollo
      .subscribe<BrandModel>({
        query: Query.getBrandByIdQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["brand"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getProductByIdIn(ids: string[]): Observable<ProductModel[]> {
    return this.apollo
      .subscribe<ProductModel[]>({
        query: Query.getProductByIdInQL,
        variables: {
          ids: ids,
        },
      })
      .pipe(
        map((result) => result.data["product"]),
        map((events) =>
          events.map((event) => this.productMapper.mapFrom(event))
        )
      );
  }

  deleteBrands(ids: string[]): Observable<BrandModel> {
    return this.apollo
      .mutate<BrandModel>({
        mutation: Query.deleteBrandsQL,
        variables: {
          ids: ids,
        },
      })
      .pipe(map((result) => result.data));
  }

  upsertBrands(brands: BrandUpload[]): Observable<any> {
    return this.apollo.mutate<BrandUpload>({
      mutation: Query.upsertBrandsQL,
      variables: {
        brands: brands,
      },
    });
  }
}
