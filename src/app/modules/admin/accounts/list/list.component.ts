import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatMenuModule } from "@angular/material/menu";
import { MatSort, MatSortModule } from "@angular/material/sort";
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
} from "@angular/router";
import { AccountService } from "app/shared/core/domain/services/account.service";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatCheckbox } from "@angular/material/checkbox";
import {
  UserModel,
} from "app/shared/core/domain/models/account.model";
import { CONSTANTS } from "app/shared/core/classes/utility";
import { ConfirmationDialogs } from "app/shared/core/classes/confirmation_dialogs";
import { TranslocoModule } from "@ngneat/transloco";
import { UserRole } from "app/shared/core/classes/roles";
import { FuseFindByKeyPipe } from "@fuse/pipes/find-by-key";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatButton,
    MatMenuModule,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatPaginator,
    MatTableModule,
    MatSortModule,
    DatePipe,
    TranslocoModule,
    FuseFindByKeyPipe,
    MatTooltip
  ],
})
export class AccountListComponent {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("selectAll") selectAllCheckBox: MatCheckbox;

  selection = new SelectionModel<any>(true, []);

  //<---------------------- Data Variables --------------------------->

  //<---------------------- Filter Variables --------------------------->

  searchText = signal<string>("");
  sponsor = signal<string>("");
  tenant = signal<string>("");
  campaign = signal<string>("");
  role = signal<number>(0);

  //<---------------------- flag Variables --------------------------->

  enableActions = signal<boolean>(false);
  showTenantFilter = signal<boolean>(false);
  showSponsorFilter = signal<boolean>(false);
  showCompaignFilter = signal<boolean>(false);

  //<---------------------- table Variables --------------------------->
  dataSource: MatTableDataSource<any>;

  itemsPerPage: number = 20;
  tableColumns: string[] = [
    "Select",
    "action",
    "title",
    "email",
    "userRole",
    "status",
    // "campaigns",
    // "company",
    "createdAt",
  ];

  //<---------------------- other Variables --------------------------->

  drawerMode: "side" | "over";

  // private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _accountService: AccountService,
    private _confirmationDialogs: ConfirmationDialogs,
  ) {}

  accounts = computed(() => {
    const data = this._accountService.applyFilters(
      this.searchText(),
      this.tenant(),
      this.sponsor(),
      this.role()
    );
    if (this.dataSource) {
      this.dataSource.data = data;
    }
    return data;
  });

  roles = computed(()=>[{id:0,title:'All'},...this._accountService.roles().filter(r=>r.id!==UserRole.SUPER_ADMINISTRATOR)]);

  // -----------------------------------------------------------------------------------------------------
  // @ Signal Methods
  // -----------------------------------------------------------------------------------------------------

  toggleAction() {
    this.enableActions.update((s) => !s);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.accounts());
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
  // @ Data Setup Methods
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

  masterToggle(event) {
    if (this.selection.selected.some((e) => e)) {
      this.clearSelection();
    } else {
      if (event.checked) {
        this.selectAllAccounts();
      } else {
        event.checked = false;
      }
    }
  }

  selectRow(event) {
    event.stopPropagation();
    if (!this.selection.selected.filter((e) => e).length) {
      this.selectAllCheckBox.indeterminate = false;
      this.toggleAction();
    } else {
      this.selectAllCheckBox.indeterminate = true;
      this.enableActions.set(true);
    }
  }

  selectAllAccounts() {
    this.selectAllCheckBox.checked = true;
    this.toggleAction();
    this.accounts().forEach((row) => this.selection.select(row));
  }

  clearSelection() {
    this.selectAllCheckBox.checked = false;
    this.toggleAction();
    this.selection.clear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Delete Methods
  // -----------------------------------------------------------------------------------------------------

  disable(account?: UserModel) {
    const multi: boolean = account === null || account === undefined;
    this._confirmationDialogs
      .confirmDisable("User", multi)
      .afterClosed()
      .subscribe((result) => {
        if (result === CONSTANTS.CONFIRMED) {
          this._accountService.removeSelectedAccounts(
            account ? [account] : this.selection.selected
          );
          this.selectAllCheckBox.indeterminate = false;
          this.toggleAction();
        }
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ filter methods
  // -----------------------------------------------------------------------------------------------------


  filterBySearch(text: string) {
    this.searchText.update(() => text);
  }
  filterBySponsors(change) {
    this.sponsor.update(() => change.value);
  }
  filterByCampaigns(change) {
    this.campaign.update(() => change.value);
  }
  filterByTenant(change) {
    this.tenant.update(() => change.value);
  }
  filterByRole(change) {
    this.role.update(() => change.value);
  }

  // pageEvent(event) {
  //   this.itemsPerPage = event.pageSize;
  // }

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
