import { inject, Injectable, signal } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { LogService } from "app/shared/logs/log.service";
import { MessageService } from "../../classes/message.service";
import {
  CampaignDeploymentPlan,
  CampaignModel,
  CampaignTeam,
  CampaignTeamMember,
  CampaignTeamStock,
  CampaignTeamStockDetail,
  CampaignUpload,
} from "../models/campaign.modal";
import { CampaignRepository } from "../repository/campaign.repository";
import { FilterUtils } from "../../classes/filter_utils";
import { CampaignStatusType } from "../../classes/utility";

@Injectable({ providedIn: "root" })
export class CampaignService {
  // Private signals
  private _campaign = signal<CampaignModel | null>(null);
  private _campaigns = signal<CampaignModel[]>([]);

  private api = inject(CampaignRepository);
  // private logger = inject(LogService);
  private messageService = inject(MessageService);

  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get campaign() {
    return this._campaign;
  }

  setCampaign(campaign: CampaignModel) {
    this.campaign.set(campaign);
  }

  get campaigns() {
    return this._campaigns;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Get methods
  // -----------------------------------------------------------------------------------------------------

  getSponsorCampaigns(id: string): Observable<CampaignModel[]> {
    return this.api.getSponsorCampaigns(id).pipe(
      catchError((e) => {
        console.log("Error fetching sponsor campaigns", e, id);
        this.messageService.errorMessage(`Failed to fetch sponsor campaigns!`);
        return of(null);
      }),
      tap((response: any) => {
        this._campaigns.set(response);
      })
    );
  }

  getCampaignById(id: string): Observable<CampaignModel[]> {
    return this.api.getCampaignById(id).pipe(
      catchError((e) => {
        console.log("Error fetching campaign by id", e, id);
        this.messageService.errorMessage(`Failed to fetch campaign by id!`);
        return of(null);
      }),
      tap((response: any) => {
        this._campaign.set(response[0]);
      })
    );
  }

  //------------------------------------------------------
  // Filter Methods
  //------------------------------------------------------

  applyFilters(
    query: string,
    status: string,
    hideCompleted: boolean
  ): CampaignModel[] {
    let campaigns: CampaignModel[] = this._campaigns();

    if (hideCompleted) {
      campaigns = campaigns.filter(
        (campaign) => new Date(campaign.event.endDate) < new Date()
      );
    }

    if (query !== "") {
      campaigns = FilterUtils.filterArrayByQuery(campaigns, query);
    }

    if (status) {
      campaigns = this.filterByStatus(campaigns, status);
    }

    return campaigns;
  }

  filterByStatus(campaigns: CampaignModel[], status): CampaignModel[] {
    let data = campaigns;
    switch (status) {
      case "all":
        // Show all events
        data = campaigns;
        break;

      case CampaignStatusType.ACTIVE_CAMPAIGNS:
        // Show only active events (events that are currently ongoing)
        const today = new Date();
        data = campaigns.filter(
          (campaign) =>
            new Date(campaign.event.startDate) <= today &&
            today <= new Date(campaign.event.endDate)
        );
        break;

      case CampaignStatusType.ENDED_CAMPAIGNS:
        // Show only events that have ended
        data = campaigns.filter(
          (campaign) => new Date(campaign.event.endDate) < new Date()
        );
        break;

      case CampaignStatusType.UPCOMING_CAMPAIGNS:
        // Show only upcoming events
        const upcomingDate = new Date();
        data = campaigns.filter(
          (campaign) => new Date(campaign.event.startDate) > upcomingDate
        );
        break;
      default: {
        data = campaigns;
      }
    }
    return data;
  }

  //------------------------------------------------------
  // @ Delete Methods
  //------------------------------------------------------

  deleteCampaignTeams(ids: string[]) {
    return this.api.deleteCampaignTeams(ids).pipe(
      catchError((e) => {
        console.log("Error deleting products!", e);
        this.messageService.errorMessage(
          `Failed to delete ${ids.length === 1 ? "team" : "teams"}!`
        );
        return of(null);
      })
    );
  }

  deleteCampaignTeamMember(ids: string[], teamId: string) {
    return this.api.deleteCampaignTeamMembers(ids, teamId).pipe(
      catchError((e) => {
        console.log("Error deleting products!", e);
        this.messageService.errorMessage(
          `Failed to delete ${ids.length === 1 ? "team" : "teams"}!`
        );
        return of(null);
      })
    );
  }

  deleteTeamStockDetails(ids: string[]) {
    return this.api.deleteTeamStockDetails(ids).pipe(
      catchError((e) => {
        console.log(
          `Error deleting campaign team stock ${
            ids.length === 1 ? "detail" : "details"
          }!`,
          e
        );
        this.messageService.errorMessage(
          `Failed to delete campaign team stock ${
            ids.length === 1 ? "detail" : "details"
          }!`
        );
        return of(null);
      })
    );
  }

  deleteCampaignDeploymentPlanQL(ids: string[]) {
    return this.api.deleteCampaignDeploymentPlanQL(ids).pipe(
      catchError((e) => {
        console.log(
          `Error deleting deployment ${ids.length === 1 ? "plan" : "plans"}!`,
          e
        );
        this.messageService.errorMessage(
          `Failed to delete deployment ${ids.length === 1 ? "plan" : "plans"}!`
        );
        return of(null);
      })
    );
  }

  //------------------------------------------------------
  // @ Add/Upsert Methods
  //------------------------------------------------------

  upsertCampaign(campaigns: CampaignUpload[]): Observable<any> {
    return this.api.upsertCampaign(campaigns).pipe(
      catchError((e) => {
        console.log("Error uploading campaigns", e);
        this.messageService.errorMessage(
          `Failed to upload ${
            campaigns.length === 1 ? "campaign" : "campaigns"
          }`
        );
        return of(null);
      }),
      tap((res: any) => {
        if (res) {
          console.log(
            `Added  ${campaigns.length} ${
              campaigns.length === 1 ? "campaign" : "campaigns"
            } successfully!`
          );
          // this._campaigns.set(campaigns);
        }
      })
    );
  }

  upsertCampaignTeams(
    teams: CampaignTeam[],
    members: CampaignTeamMember[]
  ): Observable<CampaignTeam[]> {
    return this.api.upsertCampaignTeams(teams, members).pipe(
      catchError((e) => {
        console.log("Error uploading campaign teams", e);
        this.messageService.errorMessage(
          `Failed to upload campaign${teams.length === 1 ? "team" : "teams"}`
        );
        return of(null);
      }),

      map((result) => {
        if (result) {
          console.log(
            `Added  ${teams.length} ${
              teams.length === 1 ? "team" : "teams"
            } successfully!`
          );
        }
        const teamsData = result["insert_campaign_teams"]["returning"];
        const membersData = result["insert_campaign_team_members"]["returning"];
        const data = teamsData.map((team) => {
          // Destructure and exclude __typename
          const { __typename, ...rest } = team;

          // Find all members that belong to this team
          const teamMembers = membersData.filter(
            (member) => member.teamId === team.id
          );

          // Return team data with its members
          return {
            ...rest,
            members: teamMembers.map(
              ({ __typename, ...memberRest }) => memberRest
            ),
          };
        });
        return data;
      })
    );
  }

  upsertCampaignTeamsStock(
    stock: CampaignTeamStock[]
  ): Observable<CampaignTeam[]> {
    const details = stock.flatMap((obj) => obj.stockDetails); // Extract stockDetails
    const stockList = stock.map(({ stockDetails, ...rest }) => rest);

    return this.api.upsertCampaignTeamsStock(stockList, details).pipe(
      catchError((e) => {
        console.log("Error uploading campaign stock", e);
        this.messageService.errorMessage(
          `Failed to upload campaign${stock.length === 1 ? "stock" : "stocks"}`
        );
        return of(null);
      })
    );
  }

  upsertCampaignDeploymentPlan(
    plans: CampaignDeploymentPlan[]
  ): Observable<any[]> {
    return this.api.upsertCampaignDeploymentPlan(plans).pipe(
      catchError((e) => {
        console.log("Error uploading campaign deployment plans", e);
        this.messageService.errorMessage(
          `Failed to upload campaign deployment ${
            plans.length === 1 ? "plan" : "plans"
          }`
        );
        return of(null);
      })
    );
  }
}
