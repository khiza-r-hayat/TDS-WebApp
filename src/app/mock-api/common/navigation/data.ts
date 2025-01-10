/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

const defaultNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    {
        id: 'event',
        title: 'Events',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/events',
    },
    {
        id: 'brands',
        title: 'Brand Management',
        type: 'collapsable',
        icon: 'heroicons_outline:check-badge',
        children: [
            {
                id: 'brands.brand',
                title: 'Brands',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/brands',
            },
            {
                id: 'brands.product',
                title: 'Products',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/products',
            },
        ],
    },
    {
        id: 'accounts',
        title: 'User Management',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'accounts.tenant',
                title: 'Tenants',
                type: 'basic',
                icon: 'heroicons_outline:building-office',
                link: '/tenants',
            },
            {
                id: 'accounts.sponsor',
                title: 'Sponsor Companies',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/sponsors',
            },
            {
                id: 'accounts.account',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/accounts',
            },
        ],
    },
    {
        id: 'report',
        title: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/reports',
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/settings',
    },
];
const superAdminNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    // {
    //   id: "event",
    //   title: "Search Load",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "searchCarrier",
    //   title: "Search Carrier",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "Loads",
    //   title: "Own Loads",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "ownTruck",
    //   title: "Own Truck",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    {
        id: 'load',
        title: 'Shipment Management',
        type: 'collapsable',
        icon: 'heroicons_outline:check-badge',
        children: [
            {
                id: 'load.shipments',
                title: 'My Shipments',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/shipments',
            },
            {
                id: 'load.search',
                title: 'Search Shipments',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/search',
            },
        ],
    },
    // {
    //   id: "accounts",
    //   title: "User Management",
    //   type: "collapsable",
    //   icon: "heroicons_outline:user-group",
    //   children: [
    //     {
    //       id: "accounts.tenant",
    //       title: "Tenants",
    //       type: "basic",
    //       icon: "heroicons_outline:building-office",
    //       link: "/tenants",
    //     },
    //     {
    //       id: "accounts.sponsor",
    //       title: "Sponsor Companies",
    //       type: "basic",
    //       icon: "heroicons_outline:building-office-2",
    //       link: "/sponsors",
    //     },
    //     {
    //       id: "accounts.account",
    //       title: "Users",
    //       type: "basic",
    //       icon: "heroicons_outline:users",
    //       link: "/accounts",
    //     },
    //   ],
    // },
    {
        id: 'report',
        title: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/reports',
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/settings',
    },
];

const loadAdminNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    // {
    //   id: "event",
    //   title: "Search Load",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "searchCarrier",
    //   title: "Search Carrier",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "Loads",
    //   title: "Own Loads",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "ownTruck",
    //   title: "Own Truck",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    {
        id: 'shipment',
        title: 'Shipment Management',
        type: 'collapsable',
        icon: 'heroicons_outline:check-badge',
        children: [
            {
                id: 'shipment.shipments',
                title: 'Shipments',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/shipments',
            },
            {
                id: 'shipment.search',
                title: 'Search Shipment',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/search',
            },
        ],
    },
    // {
    //   id: "accounts",
    //   title: "User Management",
    //   type: "collapsable",
    //   icon: "heroicons_outline:user-group",
    //   children: [
    //     {
    //       id: "accounts.tenant",
    //       title: "Tenants",
    //       type: "basic",
    //       icon: "heroicons_outline:building-office",
    //       link: "/tenants",
    //     },
    //     {
    //       id: "accounts.sponsor",
    //       title: "Sponsor Companies",
    //       type: "basic",
    //       icon: "heroicons_outline:building-office-2",
    //       link: "/sponsors",
    //     },
    //     {
    //       id: "accounts.account",
    //       title: "Users",
    //       type: "basic",
    //       icon: "heroicons_outline:users",
    //       link: "/accounts",
    //     },
    //   ],
    // },
    {
        id: 'report',
        title: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/reports',
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/settings',
    },
];

const operatorAdminNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    // {
    //   id: "event",
    //   title: "Search Load",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "searchCarrier",
    //   title: "Search Carrier",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "Loads",
    //   title: "Own Loads",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    // {
    //   id: "ownTruck",
    //   title: "Own Truck",
    //   type: "basic",
    //   icon: "heroicons_outline:calendar",
    //   link: "/events",
    // },
    {
        id: 'shipment',
        title: 'Shipment Management',
        type: 'collapsable',
        icon: 'heroicons_outline:check-badge',
        children: [
            {
                id: 'shipment.shipments',
                title: 'Shipments',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/shipments',
            },
            {
                id: 'shipment.search',
                title: 'Search Shipments',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/search',
            },
        ],
    },
    // {
    //   id: "accounts",
    //   title: "User Management",
    //   type: "collapsable",
    //   icon: "heroicons_outline:user-group",
    //   children: [
    //     {
    //       id: "accounts.tenant",
    //       title: "Tenants",
    //       type: "basic",
    //       icon: "heroicons_outline:building-office",
    //       link: "/tenants",
    //     },
    //     {
    //       id: "accounts.sponsor",
    //       title: "Sponsor Companies",
    //       type: "basic",
    //       icon: "heroicons_outline:building-office-2",
    //       link: "/sponsors",
    //     },
    //     {
    //       id: "accounts.account",
    //       title: "Users",
    //       type: "basic",
    //       icon: "heroicons_outline:users",
    //       link: "/accounts",
    //     },
    //   ],
    // },
    {
        id: 'report',
        title: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/reports',
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/settings',
    },
];

const sponsorNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    {
        id: 'campaign',
        title: 'Lead Campaigns',
        type: 'basic',
        icon: 'heroicons_outline:queue-list',
        link: '/campaigns',
    },
    {
        id: 'accounts',
        title: 'User Management',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/accounts',
    },
    {
        id: 'report',
        title: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/reports',
    },
];

const staffNav: FuseNavigationItem[] = [
    {
        id: 'campaign',
        title: 'Lead Campaigns',
        type: 'basic',
        icon: 'heroicons_outline:queue-list',
        link: '/reports',
    },
];

const tenantNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    {
        id: 'event',
        title: 'Events',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/events',
    },
    {
        id: 'brands',
        title: 'Brand Management',
        type: 'collapsable',
        icon: 'heroicons_outline:check-badge',
        children: [
            {
                id: 'brands.brand',
                title: 'Brands',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/brands',
            },
            {
                id: 'brands.product',
                title: 'Products',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/products',
            },
        ],
    },
    {
        id: 'accounts',
        title: 'User Management',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'accounts.sponsor',
                title: 'Sponsor Companies',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/sponsors',
            },
            {
                id: 'accounts.account',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/accounts',
            },
        ],
    },
    {
        id: 'report',
        title: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/reports',
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/settings',
    },
];

export const defaultNavigation: FuseNavigationItem[] = defaultNav;
export const sponsorNavigation: FuseNavigationItem[] = sponsorNav;
export const superAdminNavigation: FuseNavigationItem[] = superAdminNav;
export const loadAdminNavigation: FuseNavigationItem[] = loadAdminNav;
export const operatorAdminNavigation: FuseNavigationItem[] = operatorAdminNav;
export const tenenatNavigation: FuseNavigationItem[] = tenantNav;
// export const futuristicNavigation: FuseNavigationItem[] = defaultNav;
// export const horizontalNavigation: FuseNavigationItem[] = defaultNav;
export const compactNavigation: FuseNavigationItem[] = sponsorNav;
export const staffNavigation: FuseNavigationItem[] = staffNav;
