import { DateTime } from "luxon";
import { Tenant } from "./tenant.model";
import { EventModel } from "./event.model";
import { Sponsor } from "./sponsor.model";
import { CampaignModel } from "./campaign.modal";

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
  role?: Roles;
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
}

export interface AccountModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  picture: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  pictureUrl?: string;
  password?: string;
  createdBy?: string;
  isSuperAdmin: boolean;
  roleId: number;
  lastWelcomeEmailSend?: Date;
  lastLoginWeb?: Date;
  lastLoginMobile?: Date;
  createdInFirebase?: boolean;
  organizationId: string;
  campaignRoles?: UserCampaignRoles[];
  tenantRoles?: UserOrganizationRoles[];
  companyRoles?: UserSponsorRoles[];
  role?: Roles;
}

export interface AccountResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  picture: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  pictureUrl?: string;
  password?: string;
  createdBy?: string;
  isSuperAdmin: boolean;
  roleId: number;
  lastWelcomeEmailSend?: Date;
  lastLoginWeb?: Date;
  lastLoginMobile?: Date;
  organizationId: string;
  campaignRoles?: UserCampaignRoles[];
  tenantRoles?: UserOrganizationRoles[];
  companyRoles?: UserSponsorRoles[];
  role?: Roles;
}

export interface UserCampaignRoles {
  userId?: string;
  campaignId: string;
  roleId: number;
  createdAt: DateTime;
  campaign: CampaignModel;
}

export interface UserOrganizationRoles {
  userId?: string;
  tenantId?: string;
  roleId: number;
  createdAt?: DateTime;
  tenant?: Tenant;
  user?: AccountModel;
  createdByTenant?: string;
}

export interface UserSponsorRoles {
  userId?: string;
  sponsorCompanyId?: string;
  roleId: number;
  createdAt?: DateTime;
  sponsorCompany?: Sponsor;
  createdByTenant?: string;
}

export interface AccountUpload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  status: boolean;
  pictureUrl?: string;
  createdBy: string;
  organizationId: string;
  lastLoginWeb?: Date;
  companyRoles?: UserSponsorRolesRelationUpload;
  tenantRoles?: UserOrganizationRolesRelationUpload;
}

export interface UserSponsorRolesRelationUpload {
  data: UserSponsorRolesUpload;
}

export interface UserOrganizationRolesRelationUpload {
  data: UserOrganizationRolesUpload;
}

export interface UserOrganizationRolesUpload {
  tenantId: string;
  roleId: number;
}

export interface UserSponsorRolesUpload {
  sponsorCompanyId: string;
  roleId: number;
  eventId?: string;
}

export interface AccountPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

export interface Role {
  id: number;
  title: string;
}

export interface Roles {
  id: number;
  name: string;
}

export interface UserEventRoles {
  userId: string;
  eventId?: string;
  roleId: number;
  createdAt?: DateTime;
  event?: EventModel;
}

export interface AssigneeAccount {
  emails: string[];
  assignee: string;
  action: boolean;
}
