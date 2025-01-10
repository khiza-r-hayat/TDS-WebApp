import gql from 'graphql-tag';

export const ShipmentQL = gql`
    fragment ShipmentQL on shipments {
        id
        userId
        originId
        destinationId
        pickupEarliest
        pickupLatest
        pickupHours
        dropoffHours
        availableLength
        equipmentId
        weight
        comments
        commodity
        refId
        contact
        rate
        createdAt
        updatedAt
    }
`;
