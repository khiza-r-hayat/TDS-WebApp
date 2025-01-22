import { Routes } from '@angular/router';
import { RedirectComponent } from './redirect.component';

export default [
    {
        path: '',
        component: RedirectComponent,
        children: [
            {
                path: 'unauthorized',
                component: RedirectComponent,
                data: {
                    redirectType: 401,
                },
            },
            {
                path: 'notfound',
                component: RedirectComponent,
                data: {
                    redirectType: 404,
                },
            },
            {
                path: 'maintainance',
                component: RedirectComponent,
                data: {
                    redirectType: 503,
                },
            },
        ],
    },
] as Routes;
