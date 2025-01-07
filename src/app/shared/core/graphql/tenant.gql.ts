import gql from "graphql-tag";
import {
  SubscriptionQL,
  SubscriptionPlanQl,
  TenantQl,
} from "../fragments/tenant.fragment";

export const getTenantsQL = gql`
  query getTenants {
    tenants: tenant {
      ...TenantQl
      subscriptions {
        ...SubscriptionQl
        plan {
          ...SubscriptionPlanQl
        }
      }
    }
    plans: plan {
      ...SubscriptionPlanQl
    }
  }
  ${TenantQl}
  ${SubscriptionQL}
  ${SubscriptionPlanQl}
`;

export const getTenantByIdQL = gql`
  query getTenantById($id: uuid!) {
    tenants: tenant(where: { id: { _eq: $id } }) {
      ...TenantQl
      subscriptions {
        ...SubscriptionQl
        plan {
          ...SubscriptionPlanQl
        }
      }
    }
  }
  ${TenantQl}
  ${SubscriptionQL}
  ${SubscriptionPlanQl}
`;

export const upsertTenantsQL = gql`
  mutation upsertTenants(
    $tenants: [tenant_insert_input!]!
    $tenantIds: [uuid!]!
  ) {
    update_subscription(
      where: { tenantId: { _in: $tenantIds } }
      _set: { isActive: false }
    ) {
      affected_rows
    }
    tenant: insert_tenant(
      objects: $tenants
      on_conflict: {
        constraint: organization_pkey
        update_columns: [title, logo]
      }
    ) {
      returning {
        ...TenantQl
      }
    }
  }
  ${TenantQl}
`;

export const deleteTenantsQL = gql`
  mutation deleteTenantsQL($ids: [uuid!]!) {
    delete_tenant(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;
