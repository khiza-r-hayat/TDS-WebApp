import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { ReportComponent } from "./report/report.component";
import { inject } from "@angular/core";
import { DashboardService } from "app/shared/core/domain/services/dashboard.service";
import { EventService } from "app/shared/core/domain/services/event.service";

const routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: ReportComponent,
        resolve: {
          data: () => inject(DashboardService).getDashboradData(),
          locations: () => inject(EventService).getLocations(),
        },
      },
    ],
  },
];

export default routes as Routes;
