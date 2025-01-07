import { CampaignsComponent } from "./campaigns.component";
import { CampaignListComponent } from "./list/list.component";
import { CampaignsResolver } from "./campaigns.resolver";
import { Routes } from "@angular/router";

export default [
  {
    path: "",
    component: CampaignsComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: CampaignListComponent,
        resolve: {
          campaigns: CampaignsResolver,
        },
      },
    ],
  },
] as Routes;
