import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { BrandModel, BrandUpload, ProductModel } from "../models/brand.model";
import { BrandRepository } from "../repository/brand.repository";
import { LogService } from "app/shared/logs/log.service";
import { MessageService } from "../../classes/message.service";
import { BrandHelper } from "../helpers/brand.helper";
import { FilterUtils } from "../../classes/filter_utils";

@Injectable({ providedIn: "root" })
export class BrandService {
  // Private signals
  private _brand = signal<BrandModel | null>(null);
  private _brands = signal<BrandModel[] | null>(null);

  private api = inject(BrandRepository);
  // private logger = inject(LogService);
  private messageService = inject(MessageService);

  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get brand() {
    return this._brand;
  }

  get brands() {
    return this._brands;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Get methods
  // -----------------------------------------------------------------------------------------------------

  getBrandByTenant(id: string): Observable<BrandModel[]> {
    return this.api.getBrandByTenant(id).pipe(
      catchError((e) => {
        console.log("Error fetching brands by tenant!", e, id);
        this.messageService.errorMessage("Failed to fetch brands by tenant!");
        return of(null);
      }),
      tap((response: any) => {
        this._brands.set(response);
      })
    );
  }

  getBrandWithoutProductByTenant(id: string): Observable<BrandModel[]> {
    return this.api.getBrandWithoutProductByTenant(id).pipe(
      catchError((e) => {
        console.log("Error fetching brands by tenant!", e, id);
        this.messageService.errorMessage("Failed to fetch brands by tenant!");
        return of(null);
      }),
      tap((response: any) => {
        this._brands.set(response);
      })
    );
  }
  
  getLoadByUserId(id: string): Observable<BrandModel[]> {
    return this.api.getBrandWithoutProductByTenant(id).pipe(
      catchError((e) => {
        console.log("Error fetching brands by tenant!", e, id);
        this.messageService.errorMessage("Failed to fetch brands by tenant!");
        return of(null);
      }),
      tap((response: any) => {
        this._brands.set(response);
      })
    );
  }

  getBrandById(id: string): Observable<BrandModel> {
    return this.api.getBrandById(id).pipe(
      catchError((e) => {
        console.log("Error fetching brand by Id!", e, id);
        this.messageService.errorMessage("Failed to fetch brand!");
        return of(null);
      }),
      tap((response: BrandModel) => {
        this._brand.set(response[0]);
      })
    );
  }

  getProductByIdIn(ids: string[]): Observable<ProductModel[]> {
    return this.api.getProductByIdIn(ids);
  }

  //------------------------------------------------------
  // Filter Methods
  //------------------------------------------------------

  filterBrands(query: string): BrandModel[] {
    return FilterUtils.filterArrayByQuery(this.brands()??[], query);
  }

  //------------------------------------------------------
  // @ Delete Methods
  //------------------------------------------------------

  removeSelectedBrands(brands: BrandModel[]) {
    const ids = brands.map((t) => t.id);
    this.api
      .deleteBrands(ids)
      .pipe(
        catchError((e) => {
          console.log("Error deleting brands!", e);
          this.messageService.errorMessage(
            `Failed to delete ${brands.length === 1 ? "brand" : "brands"}!`
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          console.log(
            `deleted ${brands.length === 1 ? "brand" : "brands"} successfuly!`,
            ids
          );

          const brandsFiltered = this._brands().filter(
            (v) => !ids.some((a) => a === v.id)
          );

          this._brands.set(brandsFiltered);
        }
      });
  }

  //------------------------------------------------------
  // @ Add/Upsert Methods
  //------------------------------------------------------

  upsertBrands(brands: BrandUpload[]): Observable<any> {
    return this.api.upsertBrands(brands).pipe(
      catchError((e) => {
        console.log("Error uploading sponsors", e);
        this.messageService.errorMessage(
          `Failed to upload ${brands.length === 1 ? "brand" : "brands"}`
        );
        return of(null);
      }),
      tap((res: any) => {
        if (res) {
          console.log(
            `Added ${brands.length} ${
              brands.length === 1 ? "brand" : "brands"
            } successfully!`
          );
          this.addBrandsLocally(brands);
        }
      })
    );
  }

  addBrandsLocally(brands: BrandUpload[]) {
    let brandList: BrandModel[] = [...this.brands()];

    for (let brand of brands) {
      const index = brandList.findIndex((s) => s.id == brand.id);
      if (index !== -1) {
        brandList[index].name = brand.name;
        brandList[index].status = brand.status;
      } else {
        brandList.push(BrandHelper.generateBrandObject(brand, []));
      }
    }

    this._brands.set(brandList);
  }
}
