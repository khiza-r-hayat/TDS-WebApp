import {
  CampaignModel,
  CampaignResponse,
} from "app/shared/core/domain/models/campaign.modal";
import { Mapper } from "../../../base/mapper";

export class CampaignMapper extends Mapper<CampaignModel, CampaignResponse> {
  mapFrom(param: CampaignResponse): CampaignModel {
    return {
      id: param.id,
      eventId: param.eventId,
      sponsorId: param.sponsorId,
      title: param.title,
      pitch: param.pitch,
      disclaimer: param.disclaimer,
      addedBy: param.addedBy,
      updatedBy: param.updatedBy,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      campaignEmailFlag: param.campaignEmailFlag,
      event: param.event,
      sponsor: param.sponsor,
      teams: param.teams,
      teamsStock: param.teamsStock,
      deploymentPlans: param.deploymentPlans,
      submissions: param.submissions,
    };
  }

  mapTo(param: CampaignModel): CampaignResponse {
    return {
      id: param.id,
      eventId: param.eventId,
      sponsorId: param.sponsorId,
      title: param.title,
      pitch: param.pitch,
      disclaimer: param.disclaimer,
      addedBy: param.addedBy,
      updatedBy: param.updatedBy,
      status: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      campaignEmailFlag: param.campaignEmailFlag,
      event: param.event,
      sponsor: param.sponsor,
      teams: param.teams,
      teamsStock: param.teamsStock,
      deploymentPlans: param.deploymentPlans,
      submissions: param.submissions,
    };
  }
}
