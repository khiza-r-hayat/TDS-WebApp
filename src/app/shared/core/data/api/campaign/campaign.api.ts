import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/campaign.gql";

import { CampaignRepository } from "app/shared/core/domain/repository/campaign.repository";
import {
  CampaignDeploymentPlan,
  CampaignTeam,
  CampaignTeamMember,
  CampaignTeamStock,
  CampaignTeamStockDetail,
  CampaignUpload,
} from "app/shared/core/domain/models/campaign.modal";
import { CampaignMapper } from "./campaign.mapper";

@Injectable({
  providedIn: "root",
})
export class CampaignAPI implements CampaignRepository {
  private apollo = inject(Apollo);
  mapper = new CampaignMapper();

  getSponsorCampaigns(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.SponsorCampaignsQL,
        variables: {
          sponsorId: id,
        },
      })
      .pipe(
        map((result) => result.data["campaign"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getCampaignById(id: string): Observable<any[]> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.CampaignByIdQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["campaign"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  upsertCampaign(campaigns: CampaignUpload[]): Observable<any> {
    return this.apollo.mutate<CampaignUpload>({
      mutation: Query.UpsertCampaignQL,
      variables: {
        campaigns: campaigns,
      },
    });
  }

  upsertCampaignTeams(
    teams: CampaignTeam[],
    members: CampaignTeamMember[]
  ): Observable<any> {
    return this.apollo
      .mutate<CampaignTeam>({
        mutation: Query.UpsertCampaignTeamsQL,
        variables: {
          teams: teams,
          members: members,
        },
      })
      .pipe(map((result) => result.data));
  }

  upsertCampaignTeamsStock(
    stocks: CampaignTeamStock[],
    details: CampaignTeamStockDetail[]
  ): Observable<any> {
    return this.apollo
      .mutate<CampaignTeam>({
        mutation: Query.UpsertTeamStockQL,
        variables: {
          stocks: stocks,
          details: details,
        },
      })
      .pipe(map((result) => result.data));
  }

  upsertCampaignDeploymentPlan(
    plans: CampaignDeploymentPlan[]
  ): Observable<any> {
    return this.apollo
      .mutate<CampaignTeam>({
        mutation: Query.UpsertCampaignDeploymentPlanQL,
        variables: {
          plans: plans,
        },
      })
      .pipe(map((result) => result.data));
  }

  deleteCampaignDeploymentPlanQL(ids: string[]): Observable<any> {
    return this.apollo.mutate<CampaignTeam>({
      mutation: Query.DeleteCampaignDeploymentPlanQL,
      variables: {
        ids: ids,
      },
    });
  }

  deleteCampaignTeams(ids: string[]): Observable<any> {
    return this.apollo.mutate<CampaignTeam>({
      mutation: Query.DeleteCampaignTeamsQL,
      variables: {
        ids: ids,
      },
    });
  }

  deleteCampaignTeamMembers(ids: string[], teamId: string): Observable<any> {
    return this.apollo.mutate<CampaignTeam>({
      mutation: Query.DeleteCampaignTeamMembersQL,
      variables: {
        ids: ids,
        teamId: teamId,
      },
    });
  }

  deleteTeamStockDetails(ids: string[]): Observable<any> {
    return this.apollo.mutate<CampaignTeam>({
      mutation: Query.DeleteCampaignTeamsStockDetailQL,
      variables: {
        ids: ids,
      },
    });
  }
}
