import { ShipmentStatus, Utility } from '../../classes/utility';
import { BidModel, GeoLocationModel, ShipmentModel } from '../models/shipment.model';

export class ShipmentHelper {
    public static generateShipmentUploadObject(
        data: any,
        shipmentId: string,
        userId: string,
        origin: GeoLocationModel,
        destination: GeoLocationModel,
        bids:BidModel[]
    ): ShipmentModel {
        return {
            id: shipmentId,
            userId: userId,
            originAddress: data.origin,
            destinationAddress: data.destination,
            pickupEarliest: new Date(Utility.formatDate(data.pickupEarliest)),
            pickupLatest: new Date(Utility.formatDate(data.pickupLatest)),
            pickupHours:
                data.pickupHours && data.pickupHours !== ''
                    ? data.pickupHours
                    : 0,
            dropoffHours:
                data.dropoffHours && data.dropoffHours !== ''
                    ? data.dropoffHours
                    : 0,
            equipmentId: data.equipment,
            availableLength: data.availableLength,
            weight: data.weight,
            comments: data.comments,
            commodity: data.commodity,
            refId: data.refId,
            contact: data.contact,
            rate: parseInt(data.rate),
            origin: origin,
            destination: destination,
            status: ShipmentStatus.POSTED,
            open: true,
            bids: bids,
        };
    }

    public static generateShipmentObject(data: ShipmentModel): ShipmentModel {
        return {
            id: data.id,
            userId: data.userId,
            originAddress: data.originAddress,
            destinationAddress: data.destinationAddress,
            pickupEarliest: data.pickupEarliest,
            pickupLatest: data.pickupLatest,
            pickupHours: data.pickupHours,
            dropoffHours: data.dropoffHours,
            equipmentId: data.equipmentId,
            availableLength: data.availableLength,
            weight: data.weight,
            comments: data.comments,
            commodity: data.commodity,
            refId: data.refId,
            contact: data.contact,
            rate: data.rate,
            origin: data.origin,
            destination: data.destination,
            open: data.open,
            status: data.status,
            bids: data.bids,
        };
    }
}
