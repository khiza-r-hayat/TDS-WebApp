import { UserModel } from './account.model';

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

export interface BidModel {
    shipmentId: string;
    operatorId: string;
    bid: number;
    accepted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    operator?: UserModel;
    shipment?: ShipmentModel;
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
    bids: BidModel[];
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
    bids: any[];
    createdAt?: any;
    updatedAt?: any;
}
