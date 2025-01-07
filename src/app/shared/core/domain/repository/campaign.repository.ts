import { Observable } from "rxjs";
import {
  CampaignDeploymentPlan,
  CampaignTeam,
  CampaignTeamMember,
  CampaignTeamStock,
  CampaignTeamStockDetail,
  CampaignUpload,
} from "../models/campaign.modal";

export abstract class CampaignRepository {
  abstract getSponsorCampaigns(id: string): Observable<any[]>;
  abstract getCampaignById(id: string): Observable<any[]>;
  abstract upsertCampaign(campaigns: CampaignUpload[]): Observable<any[]>;
  abstract upsertCampaignTeams(
    teams: CampaignTeam[],
    teamMembers: CampaignTeamMember[]
  ): Observable<any[]>;
  abstract upsertCampaignTeamsStock(
    stock: CampaignTeamStock[],
    detail: CampaignTeamStockDetail[]
  ): Observable<any[]>;
  abstract upsertCampaignDeploymentPlan(
    plans: CampaignDeploymentPlan[]
  ): Observable<any[]>;
  abstract deleteCampaignTeams(ids: string[]): Observable<any[]>;
  abstract deleteCampaignTeamMembers(
    ids: string[],
    teamId: string
  ): Observable<any[]>;
  abstract deleteTeamStockDetails(ids: string[]): Observable<any[]>;
  abstract deleteCampaignDeploymentPlanQL(ids: string[]): Observable<any[]>;
}
