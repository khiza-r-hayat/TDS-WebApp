import gql from "graphql-tag";
import {
  CampaignDeploymentPlanQL,
  CampaignQL,
  CampaignTeamMemberQL,
  CampaignTeamQL,
  CampaignTeamStockDetailQL,
  CampaignTeamStockQL,
} from "../fragments/capmaign.fragment";
import { CampaignEventQL, TenantEventQL } from "../fragments/event.fragment";
import { SponsorQl } from "../fragments/sponsor.fragments";

export const SponsorCampaignsQL = gql`
  query SponsorCampaignsQL($sponsorId: uuid!) {
    campaign(where: { sponsorId: { _eq: $sponsorId } }) {
      ...CampaignQL
      event {
        ...CampaignEventQL
      }
    }
  }
  ${CampaignQL}
  ${CampaignEventQL}
`;

export const CampaignByIdQL = gql`
  query CampaignByIdQL($id: uuid!) {
    campaign(where: { id: { _eq: $id } }) {
      ...CampaignQL
      event {
        ...TenantEventQL
      }
      sponsor {
        ...SponsorQl
      }
      teams {
        ...CampaignTeamQL
      }
      teamsStock {
        ...CampaignTeamStockQL
        stockDetails {
          ...CampaignTeamStockDetailQL
        }
      }
      deploymentPlans {
        ...CampaignDeploymentPlanQL
      }
    }
  }
  ${CampaignQL}
  ${TenantEventQL}
  ${SponsorQl}
  ${CampaignTeamQL}
  ${CampaignTeamStockQL}
  ${CampaignTeamStockDetailQL}
  ${CampaignDeploymentPlanQL}
`;

export const UpsertCampaignQL = gql`
  mutation UpsertCampaignQL($campaigns: [campaign_insert_input!]!) {
    insert_campaign(
      objects: $campaigns
      on_conflict: {
        constraint: campaign_pkey
        update_columns: [
          title
          pitch
          disclaimer
          updatedBy
          status
          campaignEmailFlag
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export const UpsertCampaignTeamsQL = gql`
  mutation UpsertCampaignTeamsQL(
    $teams: [campaign_teams_insert_input!]!
    $members: [campaign_team_members_insert_input!]!
  ) {
    insert_campaign_teams(
      objects: $teams
      on_conflict: {
        constraint: campaign_team_pkey
        update_columns: [name, supervisorId, updatedBy]
      }
    ) {
      returning {
        ...CampaignTeamQL
      }
    }
    insert_campaign_team_members(
      objects: $members
      on_conflict: {
        constraint: campaign_team_members_pkey
        update_columns: [roleId]
      }
    ) {
      returning {
        ...CampaignTeamMemberQL
      }
    }
  }
  ${CampaignTeamQL}
  ${CampaignTeamMemberQL}
`;

export const UpsertTeamStockQL = gql`
  mutation UpsertTeamStockQL(
    $stocks: [team_stock_insert_input!]!
    $details: [team_stock_details_insert_input!]!
  ) {
    insert_team_stock(
      objects: $stocks
      on_conflict: {
        constraint: supervisor_stock_pkey
        update_columns: [
          teamId
          assignedTo
          brandId
          productId
          areaId
          stockDate
          updatedBy
        ]
      }
    ) {
      affected_rows
    }
    insert_team_stock_details(
      objects: $details
      on_conflict: {
        constraint: team_stock_details_pkey
        update_columns: [
          batchCode
          stockQuantity
          damagedStockQuantity
          returnStockQuantity
          stockTypeId
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export const UpsertCampaignDeploymentPlanQL = gql`
  mutation UpsertCampaignDeploymentPlanQL(
    $plans: [campaign_deployment_plan_insert_input!]!
  ) {
    insert_campaign_deployment_plan(
      objects: $plans
      on_conflict: {
        constraint: campaign_deployment_plan_pkey
        update_columns: [areaId, duration, startDate, endDate, updatedBy]
      }
    ) {
      affected_rows
    }
  }
`;

export const DeleteCampaignDeploymentPlanQL = gql`
  mutation DeleteCampaignDeploymentPlanQL($ids: [uuid!]!) {
    delete_campaign_deployment_plan(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

export const DeleteCampaignTeamsQL = gql`
  mutation DeleteCampaignTeamsQL($ids: [uuid!]!) {
    delete_campaign_teams(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

export const DeleteCampaignTeamMembersQL = gql`
  mutation DeleteCampaignTeamMembersQL($ids: [uuid!]!, $teamId: uuid!) {
    delete_campaign_team_members(
      where: { _and: [{ teamId: { _eq: $teamId } }, { userId: { _in: $ids } }] }
    ) {
      affected_rows
    }
  }
`;

export const DeleteCampaignTeamsStockDetailQL = gql`
  mutation DeleteCampaignTeamsStockDetailQL($ids: [uuid!]!) {
    delete_team_stock_details(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;
