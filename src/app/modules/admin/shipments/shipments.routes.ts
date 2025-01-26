import { Routes } from '@angular/router';
import { ShipmentDetailComponent } from './detail/detail.component';
import { ShipmentListComponent } from './list/list.component';
import { ShipmentsComponent } from './shipments.component';
import { myShipmentsResolver, shipmentResolver } from './shipments.resolver';

export default [
    {
        path: '',
        component: ShipmentsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ShipmentListComponent,
                resolve: {
                    myLoads: myShipmentsResolver,
                },
                data: {
                    search: false,
                }
            },
            {
                path: 'add',
                component: ShipmentDetailComponent,
            },
            {
                path: ':id',
                component: ShipmentDetailComponent,
                resolve: {
                    shipment: shipmentResolver,
                },
            },
        ],
    },
] as Routes;
