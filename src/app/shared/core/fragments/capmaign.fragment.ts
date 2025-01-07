import gql from "graphql-tag";

export const CampaignQL = gql`
  fragment CampaignQL on campaign {
    id
    eventId
    sponsorId
    title
    pitch
    disclaimer
    status
    addedBy
    createdAt
    updatedAt
    updatedBy
    campaignEmailFlag
  }
`;

export const LeadSubmissionQL = gql`
  fragment LeadSubmissionQL on lead_submission {
    id
    campaignId
    addedBy
    createdAt
    isQualify
    quality
    profileUrl
    audioUrl
    confirmationNumber
  }
`;

export const LeadSubmissionReportQL = gql`
  fragment LeadSubmissionReportQL on lead_submission {
    id
    campaignId
    createdAt
    stock {
      area {
        id
        cityId
      }
    }
  }
`;

export const CampaignDeploymentPlanQL = gql`
  fragment CampaignDeploymentPlanQL on campaign_deployment_plan {
    id
    campaignId
    areaId
    startDate
    endDate
    duration
    createdBy
    createdAt
    updatedBy
    updatedAt
  }
`;

// plannedSOGStocks
//     plannedSellingStocks
//     plannedGiveawayStocks

export const CampaignTeamStockDetailQL = gql`
  fragment CampaignTeamStockDetailQL on team_stock_details {
    id
    teamStockId
    batchCode
    stockTypeId
    stockQuantity
    returnStockQuantity
    damagedStockQuantity
    createdAt
    updatedAt
    stockType {
      ...StockTypeQL
    }
  }
`;

export const CampaignTeamStockQL = gql`
  fragment CampaignTeamStockQL on team_stock {
    id
    teamId
    campaignId
    brandId
    productId
    areaId
    stockDate
    assignedTo
    individual
    createdBy
    createdAt
    updatedAt
    updatedBy
  }
`;

export const CampaignTeamMemberQL = gql`
  fragment CampaignTeamMemberQL on campaign_team_members {
    teamId
    userId
    roleId
    addedBy
    role {
      id
      name
    }
    member {
      id
      firstName
      lastName
      roleId
    }
    addedByUser {
      id
      firstName
      lastName
      roleId
    }
  }
`;

export const CampaignTeamQL = gql`
  fragment CampaignTeamQL on campaign_teams {
    id
    campaignId
    supervisorId
    name
    createdBy
    updatedBy
    createdAt
    updatedAt
    supervisor {
      id
      firstName
      lastName
      roleId
    }
    createdByUser {
      id
      firstName
      lastName
      roleId
    }
    updatedByUser {
      id
      firstName
      lastName
      roleId
    }
    members {
      ...CampaignTeamMemberQL
    }
  }
  ${CampaignTeamMemberQL}
`;

export const CampaignDashboardQL = gql`
  fragment CampaignDashboardQL on campaign {
    ...CampaignQL
    teamsStock {
      ...CampaignTeamStockQL
      area {
        id
        cityId
      }
      stockDetails {
        ...CampaignTeamStockDetailQL
      }
    }
    deploymentPlans {
      ...CampaignDeploymentPlanQL
      area {
        id
        cityId
      }
    }
    submissions {
      ...LeadSubmissionReportQL
    }
  }
  ${CampaignQL}
  ${CampaignTeamStockQL}
  ${CampaignTeamStockDetailQL}
  ${CampaignDeploymentPlanQL}
  ${LeadSubmissionReportQL}
`;
