import { Observable } from 'rxjs';
import {
    BidModel,
    ShipmentFilterModel,
    ShipmentModel,
} from '../models/shipment.model';

export abstract class ShipmentRepository {
    abstract getShipmentsByUserId(id: string): Observable<ShipmentModel[]>;
    abstract getShipments(): Observable<ShipmentModel[]>;
    abstract getFilteredShipments(
        filter: ShipmentFilterModel
    ): Observable<ShipmentModel[]>;
    abstract getShipmentById(id: string): Observable<ShipmentModel[]>;
    abstract deleteShipments(ids: string[]): Observable<any>;
    abstract upsertShipments(shipments: ShipmentModel[]): Observable<any>;
    abstract upsertShipmentBids(bids: BidModel[]): Observable<any>;
    abstract upsertShipmentStatus(bid: BidModel): Observable<any>;
}
