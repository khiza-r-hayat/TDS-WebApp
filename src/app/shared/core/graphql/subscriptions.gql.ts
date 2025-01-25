import { gql } from 'graphql-tag';
import { UserApprovalRequestQL } from '../fragments/account.fragment';

export const GetSubscriptionsAndPlansQL = gql`
    query GetSubscriptionsAndPlansQL {
        subscription_type {
            id
            title
            days
        }
        plans: plan {
            id
            title
        }
        roles: role {
            id
            title
        }
    }
`;

export const GetUserApprovalRequestQL = gql`
    query GetUserApprovalRequestQL($userId: uuid!) {
        approval_request(where: { userId: { _eq: $userId } }) {
            ...UserApprovalRequestQL
        }
    }
    ${UserApprovalRequestQL}
`;

export const UpsertApprovalRequestQL = gql`
    mutation UpsertApprovalRequestQL($rqst: [approval_request_insert_input!]!) {
        insert_approval_request(
            objects: $rqst
            on_conflict: {
                constraint: approval_request_pkey
                update_columns: [orgName, roleId]
            }
        ) {
            returning {
                ...UserApprovalRequestQL
            }
        }
    }
    ${UserApprovalRequestQL}
`;
