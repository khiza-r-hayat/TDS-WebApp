import gql from "graphql-tag";

export const SponsorQl = gql`
  fragment SponsorQl on sponsor_company {
    id
    tenantId
    title
    logo
    createdAt
    createdBy
  }
`;
