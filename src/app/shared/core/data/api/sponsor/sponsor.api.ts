import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/sponsor.gql";
import { SponsorRepository } from "app/shared/core/domain/repository/sponsor.repository";
import { SponsorMapper } from "./sponsor.mapper";
import { SponsorUpload } from "app/shared/core/domain/models/sponsor.model";
import { LogService } from "app/shared/logs/log.service";

@Injectable({
  providedIn: "root",
})
export class SponsorAPI implements SponsorRepository {
  private apollo = inject(Apollo);
  // private logger = inject(LogService);
  mapper = new SponsorMapper();

  getSponsors(): Observable<any> {
    return this.apollo
      .subscribe<any>({
        query: Query.getSponsorsQL,
      })
      .pipe(
        map((result) => result.data["sponsor_company"]),
        map((data) => data.map((entry) => this.mapper.mapFrom(entry)))
      );
  }

  getSponsorById(id: string): Observable<any> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getSponsorByIdQL,
        variables: { id: id },
      })
      .pipe(
        map((result) => result.data["sponsor_company"]),
        map((data) => data.map((entry) => this.mapper.mapFrom(entry)))
      );
  }

  getSponsorsByTenantId(tenantId: string): Observable<any> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getSponsorsByTenantIdQL,
        variables: { tenantId: tenantId },
      })
      .pipe(
        map((result) => result.data["sponsor_company"]),
        map((data) => data.map((entry) => this.mapper.mapFrom(entry)))
      );
  }

  upsertSponsors(sponsors: SponsorUpload[]): Observable<any> {
    return this.apollo.mutate<any[]>({
      mutation: Query.upsertSponsorsQL,
      variables: {
        sponsors: sponsors,
      },
    });
  }

  deleteSponsors(ids: string[]): Observable<any> {
    return this.apollo.mutate<any[]>({
      mutation: Query.deleteSponsorsQL,
      variables: {
        ids: ids,
      },
    });
  }
}
