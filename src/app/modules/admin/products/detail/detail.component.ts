import { TextFieldModule } from "@angular/cdk/text-field";
import { Component, OnInit, signal } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Utility } from "app/shared/core/classes/utility";
import { ProductListComponent } from "../list/list.component";
import { LogService } from "app/shared/logs/log.service";
import { ProductService } from "app/shared/core/domain/services/product.service";
import {
  Product,
  ProductUpload,
} from "app/shared/core/domain/models/brand.model";
import { BrandService } from "app/shared/core/domain/services/brand.service";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    TextFieldModule,
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
})
export class ProductDetailComponent implements OnInit {
  //<--------------------- Flag Variables ---------------------->

  isSaving = signal<boolean>(false);
  editMode: boolean = false;
  //<--------------------- Data Variables ---------------------->
  productId: string = null;
  productForm: UntypedFormGroup;

  brands = this._brandService.brands;

  product = this._productService.product;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _productListComponent: ProductListComponent,
    private _productService: ProductService,
    private _brandService: BrandService,
    // private logger: LogService
  ) {}
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    if (!this._router.url.includes("add")) {
      this.editMode = true;
      this.productId = this._activatedRoute.snapshot.paramMap.get("id");
    } else {
      this.productId = Utility.generateUUID();
    }

    this._productListComponent.matDrawer.open();
    this.initializeForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Data Setup Methods
  // -----------------------------------------------------------------------------------------------------

  initializeForm() {
    this.productForm = this._formBuilder.group({
      brand: ["", [Validators.required]],
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
        Utility.noWhitespaceValidator(),
      ],
      status: ["0", [Validators.required]],
    });
    if (this.editMode) {
      this.patchForm(this.product());
    }
  }

  patchForm(product: Product) {
    this.productForm.patchValue({
      brand: product.brand.id,
      name: product.name,
      status: product.status ? "0" : "1",
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Drawer Methods
  // -----------------------------------------------------------------------------------------------------

  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._router.navigateByUrl("/products");
    return this._productListComponent.matDrawer.close();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Upload/Save Methods
  // -----------------------------------------------------------------------------------------------------

  save() {
    let formData = this.productForm.getRawValue();

    const upload: ProductUpload = {
      id: this.productId,
      name: formData.name,
      brandId: formData.brand,
      status: formData === "0",
    };

    this._productService
      .upsertProducts([upload])
      .subscribe((res) => this.closeDrawer());
  }
}
