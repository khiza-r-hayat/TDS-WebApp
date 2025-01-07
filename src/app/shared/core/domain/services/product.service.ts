import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { Product, ProductModel, ProductUpload } from "../models/brand.model";
import { LogService } from "app/shared/logs/log.service";
import { MessageService } from "../../classes/message.service";
import { ProductRepository } from "../repository/product.repository";
import { BrandHelper } from "../helpers/brand.helper";
import { FilterUtils } from "../../classes/filter_utils";

@Injectable({ providedIn: "root" })
export class ProductService {
  // Private signals
  private _product = signal<Product | null>(null);
  private _products = signal<Product[] | null>(null);

  private api = inject(ProductRepository);
  // private logger = inject(LogService);
  private messageService = inject(MessageService);

  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get product() {
    return this._product;
  }

  get products() {
    return this._products;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Get methods
  // -----------------------------------------------------------------------------------------------------

  getProducts(): Observable<Product[]> {
    return this.api.getProducts().pipe(
      catchError((e) => {
        console.log("Error fetching products", e);
        this.messageService.errorMessage(`Failed to fetch products!`);
        return of(null);
      }),
      tap((response: any) => {
        this._products.set(response);
      })
    );
  }

  getProductsByBrand(id: string): Observable<Product[]> {
    return this.api.getProductsByBrand(id).pipe(
      catchError((e) => {
        console.log("Error fetching products", e);
        this.messageService.errorMessage(`Failed to fetch products!`);
        return of(null);
      }),
      tap((response: any) => {
        this._products.set(response);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.api.getProductById(id).pipe(
      catchError((e) => {
        console.log("Error fetching product", e);
        this.messageService.errorMessage(`Failed to fetch product!`);
        return of(null);
      }),
      tap((response: Product) => {
        this._product.set(response[0]);
      })
    );
  }

  //------------------------------------------------------
  // Filter Methods
  //------------------------------------------------------

  applyFilters(query: string, brandId: string): Product[] {
    let products: Product[] = this.products();
    if (query !== "") {
      products = FilterUtils.filterArrayByQuery(products, query);
    }
    if (brandId) {
      products = products.filter((p) => p.brandId === brandId);
    }
    return products;
  }

  //------------------------------------------------------
  // @ Delete Methods
  //------------------------------------------------------

  removeSelectedProducts(products: ProductModel[]) {
    const ids = products.map((t) => t.id);
    this.api
      .deleteProducts(ids)
      .pipe(
        catchError((e) => {
          console.log("Error deleting products!", e);
          this.messageService.errorMessage(
            `Failed to delete ${
              products.length === 1 ? "product" : "products"
            }!`
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          console.log("deleted products successfuly!", ids);

          const productsFiltered = this._products().filter(
            (v) => !ids.some((a) => a === v.id)
          );

          this._products.set(productsFiltered);
        }
      });
  }

  //------------------------------------------------------
  // @ Add/Upsert Methods
  //------------------------------------------------------

  upsertProducts(products: ProductUpload[]): Observable<any> {
    return this.api.upsertProducts(products).pipe(
      catchError((e) => {
        console.log("Error uploading products", e);
        this.messageService.errorMessage(
          `Failed to upload ${products.length === 1 ? "product" : "products"}`
        );
        return of(null);
      }),
      tap((res: any) => {
        if (res) {
          console.log(
            `Added  ${products.length} ${
              products.length === 1 ? "product" : "products"
            } successfully!`
          );
          this.addProductsLocally(products);
        }
      })
    );
  }

  addProductsLocally(products: ProductUpload[]) {
    let productList: Product[] = [...this.products()];

    for (let product of products) {
      const index = productList.findIndex((s) => s.id == product.id);
      if (index !== -1) {
        productList[index].name = product.name;
        productList[index].status = product.status;
        productList[index].brandId = product.brandId;
      } else {
        productList.push(BrandHelper.generateProductObject(product));
      }
    }

    this._products.set(productList);
  }
}
