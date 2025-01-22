import {gql} from "graphql-tag"

export const  GetSubscriptionsAndPlansQL = gql`query GetSubscriptionsAndPlansQL {
    subscription_type{
      id
      title
      days
    }
      plans: plan {
        id
        title
      }
    }`