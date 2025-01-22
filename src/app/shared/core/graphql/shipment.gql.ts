import gql from 'graphql-tag';
import { ShipmentQL } from '../fragments/shipment.fragment';

export const GetShipmentsQL = gql`
    query GetShipmentByUserIdQL {
        shipments {
            ...ShipmentQL
        }
    }
    ${ShipmentQL}
`;

export const GetShipmentByUserIdQL = gql`
    query GetShipmentByUserIdQL($id: uuid!) {
        shipments(where: { userId: { _eq: $id } }) {
            ...ShipmentQL
        }
    }
    ${ShipmentQL}
`;

export const GetShipmentByIdQL = gql`
    query GetShipmentByIdQL($id: uuid!) {
        shipments(where: { id: { _eq: $id } }) {
            ...ShipmentQL
        }
    }
    ${ShipmentQL}
`;

export const DeleteShipmentsQL = gql`
    mutation DeleteShipmentsQL($ids: [uuid!]!) {
        delete_shipments(where: { id: { _in: $ids } }) {
            affected_rows
        }
    }
`;

export const UpsertShipmentsQL = gql`
    mutation UpsertShipmentsQL($shipments: [shipments_insert_input!]!) {
        insert_shipments(
            objects: $shipments
            on_conflict: {
                constraint: shipments_pkey
                update_columns: [
                    originId
                    destinationId
                    pickupEarliest
                    pickupLatest
                    pickupHours
                    dropoffHours
                    equipmentId
                    availableLength
                    weight
                    comments
                    commodity
                    refId
                    contact
                    rate
                ]
            }
        ) {
            affected_rows
        }
    }
`;
