import { Tenant } from "./tenant.model";

export interface Sponsor {
  id: string;
  tenantId: string;
  title: string;
  logo?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenant?: Tenant;
}

export interface SponsorUpload {
  id: string;
  tenantId: string;
  title: string;
  logo?: string;
  createdBy: string;
}

export interface EventSponsorUpload {
  eventId: string;
  sponsorId: string;
}
