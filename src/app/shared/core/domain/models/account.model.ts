import { UserApprovalModel } from "./shipment.model";

export interface UserModel {
  id: string;
  title: string;
  roleId: number;
  active: boolean;
  isSuperAdmin: boolean;
  email: string;
  phone: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  photo?: string;
  subscriptionId?: string;
  createdInFirebase?: boolean;
  role?: Role;
  approvalRequest?:UserApprovalModel
}

export interface UserModelUpload {
  id: string;
  title: string;
  roleId: number;
  active: boolean;
  isSuperAdmin: boolean;
  email: string;
  phone: string;
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  photo: string;
  subscriptionId?: string;
  createdInFirebase?: boolean;
  role?: Role;
}

export interface UserResponse {
  id: any;
  title: any;
  roleId: any;
  active: any;
  isSuperAdmin: any;
  email: any;
  phone: any;
  createdAt: any;
  createdBy?: any;
  updatedAt: any;
  photo: any;
  subscriptionId?: any;
  createdInFirebase?: any;
  role?: any;
  approvalRequest?:UserApprovalModel
}

export interface Role {
  id: number;
  title: string;
}

export interface Plan {
  id: number;
  title: string;
}

export interface SubscriptionType{
  id: number;
  title: string;
  days: number;
}

export interface AssigneeAccount {
  emails: string[];
  assignee: string;
  action: boolean;
}
