import { Routes } from '@angular/router';
import { SearchShipmentsComponent } from './search-shipments.component';
import { SearchShipmentListComponent } from './list/list.component';
import { allShipmentsResolver } from './search-shipments.resolver';

export default [
    {
        path: '',
        component: SearchShipmentsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: SearchShipmentListComponent,
                resolve: {
                    myLoads: allShipmentsResolver,
                },
                data: {
                    search: false,
                }
            },
            // {
            //     path: ':id',
            //     component: ShipmentBidComponent,
            //     resolve: {
            //         shipment: shipmentResolver,
            //     },
            // },
        ],
    },
] as Routes;
