import { Routes } from '@angular/router';
import { ShipmentDetailComponent } from './detail/detail.component';
import { ShipmentListComponent } from './list/list.component';
import { ShipmentsComponent } from './shipments.component';
import { myShipmentsResolver } from './shipments.resolver';

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
            },
            {
                path: 'add',
                component: ShipmentDetailComponent,
                // canDeactivate: [canDeactivateDetails],
            },
            {
                path: ':id',
                component: ShipmentDetailComponent,
                // resolve: {
                //   brand: brandResolver,
                // },
                // canDeactivate: [canDeactivateDetails],
            },
        ],
    },
] as Routes;
