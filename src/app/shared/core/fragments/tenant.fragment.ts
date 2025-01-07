import gql from "graphql-tag";

export const TenantQl = gql`
  fragment TenantQl on tenant {
    id
    title
    logo
    updatedAt
    createdAt
    createdAt
  }
`;

export const SubscriptionQL = gql`
  fragment SubscriptionQl on subscription {
    id
    tenantId
    planId
    startDate
    endDate
    isActive
    createdAt
    createdBy
    type
  }
`;

export const SubscriptionPlanQl = gql`
  fragment SubscriptionPlanQl on plan {
    id
    name
  }
`;
