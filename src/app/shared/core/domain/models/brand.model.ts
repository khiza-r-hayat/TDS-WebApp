export interface BrandModel {
    id: string;
    tenantId: string;
    name: string;
    status: boolean;
    createdAt: Date | string;
    products: ProductModel[];
}

export interface UserApprovalModel {
    id: string;
    userId: string;
    orgName: string;
    roleId: number;
    approved: boolean;
    mcNo: string;
    w9FileUrl: string;
    insuranceFileUrl: string;
}


export interface LocationModel {
    location: GeoLocationModel;
}

export interface ShipmentFilterModel {
    origin: GeoLocationModel;
    destination: GeoLocationModel;
    odh: number;
    ddh: number;
    start: Date;
    end: Date;
}

export interface GeoLocationModel {
    type: string; //'Point'
    coordinates: [number, number]; //longitude, latitude
}

export interface ShipmentModel {
    id: string;
    userId: string;
    origin: GeoLocationModel;
    originAddress: string;
    destination: GeoLocationModel;
    destinationAddress: string;
    status: string;
    open: boolean;
    pickupEarliest: Date;
    pickupLatest: Date;
    pickupHours: number;
    dropoffHours: number;
    equipmentId: string;
    availableLength: number;
    weight: number;
    comments: string;
    commodity: string;
    refId: string;
    contact: string;
    rate: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShipmentResponse {
    id: any;
    userId: any;
    origin: GeoLocationModel;
    originAddress: string;
    destination: GeoLocationModel;
    destinationAddress: string;
    status: any;
    open: any;
    pickupEarliest: any;
    pickupLatest: any;
    pickupHours: any;
    dropoffHours: any;
    equipmentId: any;
    availableLength: any;
    weight: any;
    comments: any;
    commodity: any;
    refId: any;
    contact: any;
    rate: any;
    createdAt?: any;
    updatedAt?: any;
}

export interface BrandResponse {
    id: string;
    tenantId: string;
    name: string;
    status: boolean;
    createdAt: Date | string;
    products: ProductModel[];
}

export interface ProductModel {
    id: string;
    brandId: string;
    name: string;
    status: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Product {
    id: string;
    brandId: string;
    name: string;
    status: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    brand: BrandModel;
}

export interface ProductResponse {
    id: string;
    brandId: string;
    name: string;
    status: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface BrandUpload {
    id: string;
    tenantId: string;
    name: string;
    status: boolean;
}

export interface ProductUpload {
    id: string;
    brandId: string;
    name: string;
    status: boolean;
}
