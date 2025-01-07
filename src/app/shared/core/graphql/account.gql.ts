import gql from "graphql-tag";
import { AccountsQL, RoleQL, UserQL, UserRoleQL } from "../fragments/account.fragment";

export const getAccountsQL = gql`
  query getAccountsQL {
    user {
      ...UserQL
    }
    role {
      ...UserRoleQL
    }
  }
  ${UserQL}
  ${UserRoleQL}
`;

export const getAccountsByRolesQL = gql`
  query getAccountsByRoleQL($roles: [Int!]!) {
    user(where: { roleId: { _in: $roles } }) {
      ...UserQL
    }
    role {
      ...UserRoleQL
    }
  }
  ${UserQL}
  ${UserRoleQL}
`;

export const getAccountsByTenantIdQL = gql`
  query getAccountsByTenantId($id: uuid!) {
    user(where: { tenantRoles: { tenantId: { _eq: $id } } }) {
      ...AccountsQL
    }
    role {
      ...RoleQl
    }
  }
  ${AccountsQL}
`;

export const getAccountsBySponsorIdQL = gql`
  query getAccountsBySponsorId($id: uuid!) {
    user(where: { companyRoles: { sponsorCompanyId: { _eq: $id } } }) {
      ...AccountsQL
    }
    role {
      ...RoleQl
    }
  }
  ${AccountsQL}
`;

export const getAccountsBySponsorAndRoleQL = gql`
  query getAccountsBySponsorAndRoleQL($id: uuid!, $roles: [Int!]!) {
    user(
      where: {
        _and: [
          { roleId: { _in: $roles } }
          { companyRoles: { sponsorCompanyId: { _eq: $id } } }
        ]
      }
    ) {
      ...AccountsQL
    }
  }
  ${AccountsQL}
`;

export const getAccountByIdQL = gql`
  query getAccountByIdQL($id: uuid!) {
    user(where: { id: { _eq: $id } }) {
      ...UserQL
    }
  }
  ${UserQL}
`;

export const getAccountByEmailQL = gql`
  query getAccountByEmailQL($email: String!) {
    user(where: { email: { _eq: $email } }) {
      ...UserQL
    }
  }
  ${UserQL}
`;

export const upsertAccountsQL = gql`
  mutation upsertAccount($accounts: [user_insert_input!]!) {
    insert_user(
      objects: $accounts
      on_conflict: {
        constraint: user_pkey
        update_columns: [
          title
          phone
          photo
          roleId
          active
        ]
      }
    ) {
      returning {
        ...UserQL
      }
    }
  }
  ${UserQL}
`;

export const deleteAccountsQL = gql`
  mutation deleteAccountsQL($ids: [uuid!]!) {
    delete_user(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;
