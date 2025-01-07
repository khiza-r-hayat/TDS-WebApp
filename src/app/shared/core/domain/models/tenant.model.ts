import { DateTime } from "luxon";

export interface Tenant {
  id: string;
  title: string;
  logo?: string;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  // configs: TenantConfig[];
  // events: EventModel[];
  subscriptions?: Subscriptions[];
  // emailTemplates?: TenantEmailTemplate[];
  // sponsorCompanies: SponsorCompany[];
  // tenantSponsors: TenantSponsors[];
  // userTenantRoles?:UserOrganizationRole[];
}

export interface TenantUpload {
  id: string;
  title: string;
  logo?: string;
  createdBy: string;
  subscriptions: SubscriptionRelationUpload;
}

export interface TenantForm {
  id: string;
  title: string;
  logo?: string;
  createdBy: string;
  subscription: SubscriptionUpload;
}

export interface TenantTableModel {
  id: string;
  title: string;
  sponsorsOrganization: string;
  eventOrganizers: string;
  events: string;
  activeSubscription: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionType: string;
  subscriptionStatus: string;
  createdAt: Date;
}

export interface TenantEmailTemplate {
  id?: string;
  tenantId: string;
  title: string;
  to: string;
  subject: string;
  from: string;
  template: string;
  templateType: number;
  default: boolean;
}

export interface EmailTemplate {
  id: number;
  type: string;
}

export interface SubscriptionRelationUpload {
  data: SubscriptionUpload;
}

export interface SubscriptionUpload {
  planId: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  type: string;
}

export interface Subscriptions {
  id?: string;
  tenantId: string;
  planId: number;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  plan?: Plan;
  createdBy: string;
  type: string;
}

export interface Plan {
  id: number;
  name: string;
}

export interface TenantConfig {
  id: string;
  tenantId: string;
  label: string;
  key: string;
  value: string;
  type: string;
}

export interface UserSponsorCompanyRole {
  userId?: string;
  sponsorCompanyId?: string;
  roleId: number;
  createdAt?: DateTime;
}
export interface UserOrganizationRole {
  userId?: string;
  tenantId?: string;
  roleId: number;
  createdAt?: DateTime;
}
export interface TenantSponsors {
  title?: string;
  tenantId: string;
  sponsorCompanyId: string;
  addedAt?: DateTime;
}

export interface UserRoleInfo {
  companyName: string;
  userRole: string;
  password: any;
}

export interface SessionOrganization {
  id: string;
  title: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
  configs: TenantConfig[];
}
