import gql from 'graphql-tag';

export const BidQL = gql`
    fragment BidQL on shipment_bids {
        shipmentId
        operatorId
        bid
        accepted
        createdAt
        updatedAt
        operator {
            id
            title
        }
    }
`;

export const ShipmentQL = gql`
    fragment ShipmentQL on shipments {
        id
        userId
        origin
        originAddress
        destination
        destinationAddress
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
        status
        open
        bids {
            ...BidQL
        }
    }
    ${BidQL}
`;
