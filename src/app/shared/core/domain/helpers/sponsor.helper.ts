import {
  EventSponsorUpload,
  Sponsor,
  SponsorUpload,
} from "../models/sponsor.model";
import { Tenant } from "../models/tenant.model";

export class SponsorHelper {
  public static generateSponsorObject(
    sponsor: SponsorUpload,
    tenant: Tenant
  ): Sponsor {
    return {
      id: sponsor.id,
      tenantId: sponsor.tenantId,
      title: sponsor.title,
      logo: sponsor.logo,
      createdAt: new Date(),
      createdBy: sponsor.createdBy,
      tenant: tenant,
    };
  }

  public static generateEventSponsorObject(
    sponsor: Sponsor,
    eventId: string
  ): EventSponsorUpload {
    return {
      eventId: eventId,
      sponsorId: sponsor.id,
    };
  }
}
