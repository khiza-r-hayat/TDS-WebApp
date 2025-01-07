import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  computed,
  signal,
  ViewChild,
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatOption } from "@angular/material/core";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSelect } from "@angular/material/select";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ConfirmationDialogs } from "app/shared/core/classes/confirmation_dialogs";
import { CONSTANTS } from "app/shared/core/classes/utility";
import { BrandModel } from "app/shared/core/domain/models/brand.model";
import { ProductService } from "app/shared/core/domain/services/product.service";
import { LogService } from "app/shared/logs/log.service";
import { BrandNamePipe } from "../pipes/brandname.pipe";
import { BrandService } from "app/shared/core/domain/services/brand.service";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    TranslocoModule,
    MatFormField,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatIcon,
    MatPaginator,
    RouterLink,
    DatePipe,
    BrandNamePipe,
  ],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
})
export class ProductListComponent {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  // dataSourceBulkImport: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("selectAll") selectAllCheckBox: MatCheckbox;

  //<--------------------- Table Variables ---------------------->
  dataSource: MatTableDataSource<any>;

  drawerMode: "side" | "over";
  itemsPerPage = 20;
  tableColumns: string[] = ["select", "action", "title", "brand", "createdAt"];

  selection = new SelectionModel<any>(true, []);

  //<--------------------- Flag Variables ---------------------->

  enableActions = signal<boolean>(false);

  //<--------------------- Filter Variables ---------------------->

  searchText = signal<string>("");
  brandId = signal<string>("");

  //<--------------------- Data Variables ---------------------->
  brands = this._brandService.brands;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService,
    private _confirmationDialogs: ConfirmationDialogs,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    // private logger: LogService
  ) {}

  products = computed(() => {
    const data = this._productService.applyFilters(
      this.searchText(),
      this.brandId()
    );
    if (this.dataSource) {
      this.dataSource.data = data;
    }
    return data;
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.products());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ngOnDestroy(): void {
  //   // Unsubscribe from all subscriptions
  //   this._unsubscribeAll.next(null);
  //   this._unsubscribeAll.complete();
  // }

  // -----------------------------------------------------------------------------------------------------
  // @ Drawer Methods
  // -----------------------------------------------------------------------------------------------------

  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(["./"], { relativeTo: this._activatedRoute });
    this.matDrawer.close();

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Selection Methods
  // -----------------------------------------------------------------------------------------------------

  toggleActions() {
    this.enableActions.update((s) => !s);
  }

  masterToggle(event) {
    if (this.selection.selected.some((e) => e)) {
      this.clearSelection();
    } else {
      if (event.checked) {
        this.selectAllTenants();
      } else {
        event.checked = false;
      }
    }
  }

  selectRow(event) {
    event.stopPropagation();
    if (!this.selection.selected.filter((e) => e).length) {
      this.selectAllCheckBox.indeterminate = false;
      this.toggleActions();
    } else {
      this.selectAllCheckBox.indeterminate = true;
      this.enableActions.set(true);
    }
  }

  selectAllTenants() {
    this.selectAllCheckBox.checked = true;
    this.toggleActions();
    this.products().forEach((row) => this.selection.select(row));
  }

  clearSelection() {
    this.selectAllCheckBox.checked = false;
    this.toggleActions();
    this.selection.clear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Filter Methods
  // -----------------------------------------------------------------------------------------------------

  filterBySearch(text: string) {
    this.searchText.update(() => text);
  }

  filterByBrand(change) {
    this.brandId.update(() => change.value);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Delete Methods
  // -----------------------------------------------------------------------------------------------------

  remove(product?: BrandModel) {
    const multi: boolean = product === null || product === undefined;
    this._confirmationDialogs
      .confirmDelete("Brand", multi)
      .afterClosed()
      .subscribe((result) => {
        if (result === CONSTANTS.CONFIRMED) {
          this._productService.removeSelectedProducts(
            product ? [product] : this.selection.selected
          );
          this.clearSelection();
        }
      });
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
