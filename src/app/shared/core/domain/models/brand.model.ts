export interface BrandModel {
    id: string;
    tenantId: string;
    name: string;
    status: boolean;
    createdAt: Date | string;
    products: ProductModel[];
}

export interface ShipmentModel {
    id: string;
    userId: string;
    originId: string;
    destinationId: string;
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
    rate: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShipmentResponse {
    id: any;
    userId: any;
    originId: any;
    destinationId: any;
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
