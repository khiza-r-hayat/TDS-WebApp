import { Observable } from 'rxjs';
import { ShipmentFilterModel, ShipmentModel } from '../models/brand.model';

export abstract class ShipmentRepository {
    abstract getShipmentsByUserId(id: string): Observable<ShipmentModel[]>;
    abstract getShipments(): Observable<ShipmentModel[]>;
    abstract getFilteredShipments(filter:ShipmentFilterModel): Observable<ShipmentModel[]>;
    abstract getShipmentById(id: string): Observable<ShipmentModel[]>;
    abstract deleteShipments(ids: string[]): Observable<any>;
    abstract upsertShipments(shipments: ShipmentModel[]): Observable<any>;
}
