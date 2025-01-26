import {
    ShipmentModel,
    ShipmentResponse,
} from 'app/shared/core/domain/models/shipment.model';
import { Mapper } from '../../../base/mapper';

export class ShipmentMapper extends Mapper<ShipmentResponse, ShipmentModel> {
    mapFrom(param: ShipmentResponse): ShipmentModel {
        return {
            id: param.id,
            userId: param.userId,
            origin: param.origin,
            originAddress: param.originAddress,
            destination:param.destination,
            destinationAddress: param.destinationAddress,
            pickupEarliest: param.pickupEarliest,
            pickupLatest: param.pickupLatest,
            pickupHours: param.pickupHours,
            dropoffHours: param.dropoffHours,
            equipmentId: param.equipmentId,
            availableLength: param.availableLength,
            weight: param.weight,
            comments: param.comments,
            commodity: param.commodity,
            refId: param.refId,
            contact: param.contact,
            rate: param.rate,
            createdAt: param.createdAt,
            updatedAt: param.updatedAt,
            open: param.open,
            status: param.status,
        };
    }

    mapTo(param: ShipmentModel): ShipmentResponse {
        return {
            id: param.id,
            userId: param.userId,
            origin: param.origin,
            originAddress: param.originAddress,
            destination:param.destination,
            destinationAddress: param.destinationAddress,
            pickupEarliest: param.pickupEarliest,
            pickupLatest: param.pickupLatest,
            pickupHours: param.pickupHours,
            dropoffHours: param.dropoffHours,
            equipmentId: param.equipmentId,
            availableLength: param.availableLength,
            weight: param.weight,
            comments: param.comments,
            commodity: param.commodity,
            refId: param.refId,
            contact: param.contact,
            rate: param.rate,
            createdAt: param.createdAt,
            updatedAt: param.updatedAt,
            open: param.open,
            status: param.status,
        };
    }
}
