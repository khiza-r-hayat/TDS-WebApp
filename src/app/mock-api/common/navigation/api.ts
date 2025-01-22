import { Injectable } from "@angular/core";
import { cloneDeep } from "lodash-es";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { FuseMockApiService } from "@fuse/lib/mock-api";
import {
  compactNavigation,
  defaultNavigation,
  inactiveUserNavigation,
  loadAdminNavigation,
  operatorAdminNavigation,
  // defaultNavigation,
  // futuristicNavigation,
  // horizontalNavigation,
  sponsorNavigation,
  staffNavigation,
  superAdminNavigation,
  tenenatNavigation,
} from "app/mock-api/common/navigation/data";

@Injectable({
  providedIn: "root",
})
export class NavigationMockApi {
  private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
  private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
  private readonly _staffNavigation: FuseNavigationItem[] = staffNavigation;
  private readonly _tenantNavigation: FuseNavigationItem[] = tenenatNavigation;
  // private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
  // private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;
  private readonly _sponsorNavigation: FuseNavigationItem[] = sponsorNavigation;
  private readonly _superAdminNavigation: FuseNavigationItem[] = superAdminNavigation;
  private readonly _loadAdminNavigation: FuseNavigationItem[] = loadAdminNavigation;
  private readonly _operatorAdminNavigation: FuseNavigationItem[] = operatorAdminNavigation;
  private readonly _inactiveUserNavigation: FuseNavigationItem[] = inactiveUserNavigation;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Navigation - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onGet("api/common/navigation").reply(() => {
      // Fill compact navigation children using the default navigation
      this._compactNavigation.forEach((compactNavItem) => {
        this._sponsorNavigation.forEach((defaultNavItem) => {
          if (defaultNavItem.id === compactNavItem.id) {
            compactNavItem.children = cloneDeep(defaultNavItem.children);
          }
        });
      });

      // // Fill futuristic navigation children using the default navigation
      // this._futuristicNavigation.forEach((futuristicNavItem) => {
      //     this._defaultNavigation.forEach((defaultNavItem) => {
      //         if ( defaultNavItem.id === futuristicNavItem.id )
      //         {
      //             futuristicNavItem.children = cloneDeep(defaultNavItem.children);
      //         }
      //     });
      // });

      // // Fill horizontal navigation children using the default navigation
      // this._horizontalNavigation.forEach((horizontalNavItem) => {
      //     this._defaultNavigation.forEach((defaultNavItem) => {
      //         if ( defaultNavItem.id === horizontalNavItem.id )
      //         {
      //             horizontalNavItem.children = cloneDeep(defaultNavItem.children);
      //         }
      //     });
      // });

      // Return the response
      return [
        200,
        {
          compact: cloneDeep(this._compactNavigation),
          tenant: cloneDeep(this._tenantNavigation),
          superAdmin: cloneDeep(this._superAdminNavigation),
          loadAdmin: cloneDeep(this._loadAdminNavigation),
          inActive: cloneDeep(this._inactiveUserNavigation),
          operatorAdmin: cloneDeep(this._operatorAdminNavigation),
          staff: cloneDeep(this._staffNavigation),
          sponsor: cloneDeep(this._sponsorNavigation),
          default: cloneDeep(this._defaultNavigation),
        },
      ];
    });
  }
}
