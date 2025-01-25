import gql from "graphql-tag";

export const RoleQL = gql`
  fragment RoleQl on role {
    id
    name
  }
`;

export const UserRoleQL = gql`
  fragment UserRoleQL on role {
    id
    title
  }
`;

export const UserApprovalRequestQL = gql`
 fragment UserApprovalRequestQL on approval_request {
  id
  orgName
  roleId
  approved
  userId
  mcNo
  w9FileUrl
  insuranceFileUrl
}
`;

export const SessionQL = gql`
  fragment SessionQL on user_session {
    id
    userId
    createdAt
    expiresAt
    impersonatedId
    organizationId
    tenantId
    impersonatedAs {
      ...AccountsQL
    }
    user {
      ...AccountsQL
    }
  }
`;

export const AccountsQL = gql`
  fragment AccountsQL on user {
    id
    firstName
    lastName
    email
    phone
    gender
    status
    createdAt
    updatedAt
    pictureUrl
    createdBy
    roleId
    campaignRoles {
      campaignId
      campaign {
        id
        title
      }
    }
    tenantRoles {
      tenantId
      tenant {
        id
        title
      }
    }
    companyRoles {
      sponsorCompanyId
      sponsorCompany {
        id
        title
        tenantId
      }
    }
    role {
      ...RoleQl
    }
    isSuperAdmin
    lastWelcomeEmailSend
    lastLoginWeb
    lastLoginMobile
  }
  ${RoleQL}
`;

export const UserQL = gql`
  fragment UserQL on user {
  id
  title
  email
  phone
  active
  createdAt
  updatedAt
  photo
  createdBy
  roleId
  isSuperAdmin
  role {
    id
    title
  }
  approvalRequest{
    ...UserApprovalRequestQL
  }
}
${UserApprovalRequestQL}
`;
