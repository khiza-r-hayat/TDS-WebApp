import { Utility } from '../../classes/utility';
import { ShipmentModel } from '../models/brand.model';

export class ShipmentHelper {
    public static generateShipmentUploadObject(
        data: any,
        shipmentId: string,
        userId: string
    ): ShipmentModel {
        return {
            id: shipmentId,
            userId: userId,
            originId: data.origin,
            destinationId: data.destination,
            pickupEarliest: new Date(Utility.formatDate(data.pickupEarliest)),
            pickupLatest: new Date(Utility.formatDate(data.pickupLatest)),
            pickupHours: data.pickupHours,
            dropoffHours: data.dropoffHours,
            equipmentId: data.equipment,
            availableLength: data.availableLength,
            weight: data.weight,
            comments: data.comments,
            commodity: data.commodity,
            refId: data.refId,
            contact: data.contact,
            rate: data.rate,
        };
    }

    public static generateShipmentObject(data: ShipmentModel): ShipmentModel {
        return {
            id: data.id,
            userId: data.userId,
            originId: data.originId,
            destinationId: data.destinationId,
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
        };
    }
}
