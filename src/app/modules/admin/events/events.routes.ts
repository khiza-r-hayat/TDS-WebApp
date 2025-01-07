import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";

// import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
import { catchError, throwError } from "rxjs";
import { EventsComponent } from "./events.component";
import { EventService } from "app/shared/core/domain/services/event.service";
import { EventsListComponent } from "./list/list.component";
import { EventDetailsComponent } from "./details/details.component";
import { eventResolver, eventsResolver } from "./event.resolver";

export default [
  {
    path: "",
    component: EventsComponent,
    // resolve: {
    //     categories: () => inject(EventService).getEventByTenant(""),
    // },
    children: [
      {
        path: "",
        pathMatch: "full",
        component: EventsListComponent,
        resolve: {
          events: eventsResolver,
        },
      },
      {
        path: ":id",
        component: EventDetailsComponent,
        resolve: {
          event: eventResolver,
        },
      },
    ],
  },
] as Routes;
