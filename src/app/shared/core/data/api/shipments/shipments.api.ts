import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';
import { ShipmentFilterModel, ShipmentModel } from 'app/shared/core/domain/models/shipment.model';
import { ShipmentRepository } from 'app/shared/core/domain/repository/shipment.repository';
import * as Query from 'app/shared/core/graphql/shipment.gql';
import { ShipmentMapper } from './shipment.mapper';

@Injectable({
    providedIn: 'root',
})
export class ShipmentAPI implements ShipmentRepository {
    private apollo = inject(Apollo);
    mapper = new ShipmentMapper();

    getShipments(): Observable<ShipmentModel[]> {
        return this.apollo
            .subscribe<ShipmentModel>({
                query: Query.GetShipmentsQL,
            })
            .pipe(
                map((result) => result.data['shipments']),
                map((events) =>
                    events.map((event) => this.mapper.mapFrom(event))
                )
            );
    }
    
    getFilteredShipments(filter:ShipmentFilterModel): Observable<ShipmentModel[]> {
        return this.apollo
            .subscribe<ShipmentModel>({
                query: Query.FilterShipmentsQL,
                variables:{
                    "origin": filter.origin,
                      "destination": filter.destination,
                      "odh": filter.odh,
                      "ddh": filter.ddh,
                      "start": filter.start,
                      "end": filter.end
                }
            })
            .pipe(
                map((result) => result.data['shipments']),
                map((events) =>
                    events.map((event) => this.mapper.mapFrom(event))
                )
            );
    }

    getShipmentsByUserId(id: string): Observable<ShipmentModel[]> {
        return this.apollo
            .subscribe<ShipmentModel>({
                query: Query.GetShipmentByUserIdQL,
                variables: {
                    id: id,
                },
            })
            .pipe(
                map((result) => result.data['shipments']),
                map((events) =>
                    events.map((event) => this.mapper.mapFrom(event))
                )
            );
    }

    getShipmentById(id: string): Observable<ShipmentModel[]> {
        return this.apollo
            .subscribe<ShipmentModel>({
                query: Query.GetShipmentByIdQL,
                variables: {
                    id: id,
                },
            })
            .pipe(
                map((result) => result.data['shipments']),
                map((events) =>
                    events.map((event) => this.mapper.mapFrom(event))
                )
            );
    }

    deleteShipments(ids: string[]): Observable<ShipmentModel> {
        return this.apollo
            .mutate<ShipmentModel>({
                mutation: Query.DeleteShipmentsQL,
                variables: {
                    ids: ids,
                },
            })
            .pipe(map((result) => result.data));
    }

    upsertShipments(shipments: ShipmentModel[]): Observable<any> {
        return this.apollo.mutate<ShipmentModel[]>({
            mutation: Query.UpsertShipmentsQL,
            variables: {
                shipments: shipments,
            },
        });
    }
}
