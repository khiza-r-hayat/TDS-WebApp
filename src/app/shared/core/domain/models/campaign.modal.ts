import { AccountModel, Roles } from "./account.model";
import { AreaModel, EventModel, StockTypeModel } from "./event.model";
import { Sponsor } from "./sponsor.model";

export interface CampaignUpload {
  id?: string;
  eventId: string;
  sponsorId: string;
  pitch: string;
  title: string;
  disclaimer?: boolean;
  status: boolean;
  addedBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  campaignEmailFlag?: boolean;
}

export interface CampaignModel {
  id: string;
  eventId: string;
  sponsorId: string;
  pitch: string;
  title: string;
  disclaimer?: boolean;
  status: boolean;
  addedBy: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  campaignEmailFlag?: boolean;
  event: EventModel;
  sponsor: Sponsor;
  teams: CampaignTeam[];
  teamsStock: CampaignTeamStock[];
  deploymentPlans: CampaignDeploymentPlan[];
  submissions: CampaignSubmission[];
}

export interface CampaignResponse {
  id: string;
  eventId: string;
  sponsorId: string;
  pitch: string;
  title: string;
  disclaimer?: boolean;
  status: boolean;
  addedBy: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  campaignEmailFlag?: boolean;
  event: any;
  sponsor: any;
  teams: any[];
  teamsStock: any[];
  deploymentPlans: any[];
  submissions: any[];
}

export interface CampaignTeam {
  id: string;
  campaignId: string;
  name: string;
  supervisorId: string;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdByUser?: AccountModel;
  updatedByUser?: AccountModel;
  members?: CampaignTeamMember[];
  teamStock?: CampaignTeamStock[];
}

export interface CampaignTeamMember {
  teamId: string;
  userId: string;
  addedBy: string;
  roleId: number;
  createdAt?: Date;
  member?: AccountModel;
  role?: Roles;
  addedByUser?: AccountModel;
}

export interface CampaignTeamStock {
  id: string;
  campaignId: string;
  teamId: string;
  brandId: string;
  productId: string;
  areaId: string;
  createdBy: string;
  updatedBy: string;
  assignedTo: string;
  individual: boolean;
  stockDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user?: AccountModel;
  area?: AreaModel;
  stockDetails?: CampaignTeamStockDetail[];
}

export interface CampaignTeamStockDetail {
  id: string;
  teamStockId: string;
  batchCode: string;
  stockTypeId: string;
  stockQuantity: number;
  returnStockQuantity: number;
  damagedStockQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  stockType?: StockTypeModel;
}

export interface CampaignDeploymentPlan {
  id: string;
  campaignId: string;
  areaId: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt?: Date;
  updatedBy: string;
  updatedAt?: Date;
  // plannedSellingStocks: number;
  // plannedSOGStocks: number;
  // plannedGiveawayStocks: number;
  area?: AreaModel;
}

export interface CampaignSubmission {
  id: string;
  addedBy: string;
  source: string;
  quality: number;
  isQualify: boolean;
  profileUrl: string;
  audioUrl: string;
  createdAt: Date;
  campaignId: string;
  confirmationNumber: string;
  stock?: CampaignTeamStock;
}
