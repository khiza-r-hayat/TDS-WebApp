import { Observable } from "rxjs";
import { Sponsor, SponsorUpload } from "../models/sponsor.model";

export abstract class SponsorRepository {
  abstract getSponsors(): Observable<any[]>;
  abstract getSponsorById(id: string): Observable<any>;
  abstract getSponsorsByTenantId(id: string): Observable<any>;
  abstract upsertSponsors(sponsors: SponsorUpload[]): Observable<any>;
  abstract deleteSponsors(ids: string[]): Observable<any>;
}
