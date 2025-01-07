import gql from "graphql-tag";
import { TenantQl } from "../fragments/tenant.fragment";
import { SponsorQl } from "../fragments/sponsor.fragments";

export const getSponsorsQL = gql`
  query getSponsors {
    sponsor_company {
      ...SponsorQl
      tenant {
        ...TenantQl
      }
    }
  }
  ${SponsorQl}
  ${TenantQl}
`;

export const getSponsorByIdQL = gql`
  query getSponsorById($id: uuid!) {
    sponsor_company(where: { id: { _eq: $id } }) {
      ...SponsorQl
      tenant {
        ...TenantQl
      }
    }
  }
  ${SponsorQl}
  ${TenantQl}
`;

export const getSponsorsByTenantIdQL = gql`
  query getSponsorsByTenantId($tenantId: uuid!) {
    sponsor_company(where: { tenantId: { _eq: $tenantId } }) {
      ...SponsorQl
      tenant {
        ...TenantQl
      }
    }
  }
  ${SponsorQl}
  ${TenantQl}
`;

export const upsertSponsorsQL = gql`
  mutation upsertSponsors($sponsors: [sponsor_company_insert_input!]!) {
    insert_sponsor_company(
      objects: $sponsors
      on_conflict: {
        constraint: sponsor_organization_pkey
        update_columns: [title, logo]
      }
    ) {
      affected_rows
    }
  }
`;

export const deleteSponsorsQL = gql`
  mutation deleteSponsorsQL($ids: [uuid!]!) {
    delete_sponsor_company(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;
