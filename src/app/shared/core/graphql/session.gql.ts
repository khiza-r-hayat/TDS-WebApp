import gql from "graphql-tag";
import { AccountsQL, RoleQL, SessionQL } from "../fragments/account.fragment";

export const createUserSessionQL = gql`
  mutation createSession($session: user_session_insert_input!) {
    insert_user_session_one(object: $session) {
      id
    }
  }
`;

export const getUserSessionQL = gql`
  query getUserSessionQL($id: uuid!) {
    user_session(
      where: {
        _and: [{ userId: { _eq: $id } }, { expiresAt: { _gt: "now()" } }]
      }
      order_by: { createdAt: desc }
      limit: 2
    ) {
      ...SessionQl
    }
  }
  ${SessionQL}
  ${AccountsQL}
`;

export const getSessionByIdQl = gql`
  query getUserSessionQL($id: uuid!) {
    user_session(
      where: { _and: [{ id: { _eq: $id } }, { expiresAt: { _gt: "now()" } }] }
    ) {
      ...SessionQL
    }
  }
  ${SessionQL}
  ${AccountsQL}
`;

export const expireUserSessionQL = gql`
  mutation updateSessionExpireTime($sessionId: uuid!) {
    update_user_session(
      where: { id: { _eq: $sessionId } }
      _set: { expiresAt: "now()" }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const getRolesQL = gql`
  query getRoles {
    role {
      ...RoleQl
    }
  }
  ${RoleQL}
`;
