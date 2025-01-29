import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { FilterUtils } from '../../classes/filter_utils';
import { MessageService } from '../../classes/message.service';
import { ShipmentHelper } from '../helpers/shipment.helper';
import {
    BidModel,
    ShipmentFilterModel,
    ShipmentModel,
} from '../models/shipment.model';
import { ShipmentRepository } from '../repository/shipment.repository';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
    // Private signals
    private _shipment = signal<ShipmentModel | null>(null);
    private _shipments = signal<ShipmentModel[]>([]);

    private api = inject(ShipmentRepository);
    // private logger = inject(LogService);
    private messageService = inject(MessageService);

    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get shipment() {
        return this._shipment;
    }

    get shipments() {
        return this._shipments;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Get methods
    // -----------------------------------------------------------------------------------------------------

    getShipmentByUserId(id: string): Observable<ShipmentModel[]> {
        return this.api.getShipmentsByUserId(id).pipe(
            catchError((e) => {
                console.log('Error fetching shipments by user id!', e, id);
                this.messageService.errorMessage(
                    'Failed to fetch shipments by user id!'
                );
                return of(null);
            }),
            tap((response: any) => {
                this._shipments.set(response);
            })
        );
    }

    getShipments(): Observable<ShipmentModel[]> {
        return this.api.getShipments().pipe(
            catchError((e) => {
                console.log('Error fetching shipments!', e);
                this.messageService.errorMessage('Failed to fetch shipments!');
                return of(null);
            }),
            tap((response: any) => {
                this._shipments.set(response);
            })
        );
    }

    getShipmentById(id: string): Observable<ShipmentModel[]> {
        return this.api.getShipmentById(id).pipe(
            catchError((e) => {
                console.log('Error fetching shipment by Id!', e, id);
                this.messageService.errorMessage('Failed to fetch shipment!');
                return of(null);
            }),
            tap((response: ShipmentModel[]) => {
                this._shipment.set(response[0]);
            })
        );
    }

    //------------------------------------------------------
    // Filter Methods
    //------------------------------------------------------

    filterShipments(query: string): ShipmentModel[] {
        return FilterUtils.filterArrayByQuery(this.shipments() ?? [], query);
    }

    getFilteredShipments(
        filter: ShipmentFilterModel
    ): Observable<ShipmentModel[]> {
        return this.api.getFilteredShipments(filter).pipe(
            catchError((e) => {
                console.log('Error fetching shipments!', e);
                this.messageService.errorMessage('Failed to fetch shipments!');
                return of(null);
            }),
            tap((response: any) => {
                this._shipments.set(response);
            })
        );
    }

    //------------------------------------------------------
    // @ Delete Methods
    //------------------------------------------------------

    removeSelectedShipments(shipments: ShipmentModel[]) {
        const ids = shipments.map((t) => t.id);
        this.api
            .deleteShipments(ids)
            .pipe(
                catchError((e) => {
                    console.log('Error deleting shipments!', e);
                    this.messageService.errorMessage(
                        `Failed to delete ${shipments.length === 1 ? 'shipment' : 'shipments'}!`
                    );
                    return of(null);
                })
            )
            .subscribe((res) => {
                if (res) {
                    console.log(
                        `deleted ${shipments.length === 1 ? 'shipment' : 'shipments'} successfuly!`,
                        ids
                    );

                    const shipmentsFiltered = this._shipments().filter(
                        (v) => !ids.some((a) => a === v.id)
                    );

                    this._shipments.set(shipmentsFiltered);
                }
            });
    }

    //------------------------------------------------------
    // @ Add/Upsert Methods
    //------------------------------------------------------

    upsertShipments(shipments: ShipmentModel[]): Observable<any> {
        return this.api.upsertShipments(shipments).pipe(
            catchError((e) => {
                console.log('Error uploading sponsors', e);
                this.messageService.errorMessage(
                    `Failed to upload ${shipments.length === 1 ? 'shipment' : 'shipments'}`
                );
                return of(null);
            }),
            tap((res: any) => {
                if (res) {
                    console.log(
                        `Added ${shipments.length} ${
                            shipments.length === 1 ? 'shipment' : 'shipments'
                        } successfully!`
                    );
                    this.addShipmentsLocally(shipments);
                }
            })
        );
    }

    upsertShipmentBids(bids: BidModel[]): Observable<any> {
        return this.api.upsertShipmentBids(bids).pipe(
            catchError((e) => {
                this.messageService.errorMessage(
                    `Failed to upload ${bids.length === 1 ? 'bid' : 'bids'}`
                );
                return of(null);
            }),
            tap((res: any) => {
                if (res) {
                    console.log(
                        `Added ${bids.length} ${
                            bids.length === 1 ? 'bid' : 'bids'
                        } successfully!`
                    );
                }
            })
        );
    }

    addShipmentsLocally(shipments: ShipmentModel[]) {
        let shipmentList: ShipmentModel[] = this._shipments();

        for (let shipment of shipments) {
            const index = shipmentList.findIndex((s) => s.id == shipment.id);
            if (index !== -1) {
                shipmentList[index] = { ...shipment };
            } else {
                shipmentList.push(
                    ShipmentHelper.generateShipmentObject(shipment)
                );
            }
        }

        this._shipments.set(shipmentList);
    }
}
