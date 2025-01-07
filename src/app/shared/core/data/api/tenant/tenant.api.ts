import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/tenant.gql";
import { TenantMapper } from "./tenant.mapper";
import { TenantRepository } from "app/shared/core/domain/repository/tenant.repository";
import { TenantUpload } from "app/shared/core/domain/models/tenant.model";

@Injectable({
  providedIn: "root",
})
export class TenantAPI implements TenantRepository {
  private apollo = inject(Apollo);
  mapper = new TenantMapper();

  getTenants(): Observable<any> {
    return this.apollo.subscribe<any>({
      query: Query.getTenantsQL,
    });
  }

  getTenantById(id: string): Observable<any> {
    return this.apollo
      .subscribe<any[]>({
        query: Query.getTenantByIdQL,
        variables: { id: id },
      })
      .pipe(
        map((result) => result.data["tenants"]),
        map((data) => data.map((entry) => this.mapper.mapFrom(entry)))
      );
  }

  upsertTenants(tenants: TenantUpload[]): Observable<any> {
    const tenantIds = tenants.map((t) => t.id);
    return this.apollo.mutate<any[]>({
      mutation: Query.upsertTenantsQL,
      variables: {
        tenants: tenants,
        tenantIds: tenantIds,
      },
    });
  }

  deleteTenants(ids: string[]): Observable<any> {
    return this.apollo.mutate<any[]>({
      mutation: Query.deleteTenantsQL,
      variables: {
        ids: ids,
      },
    });
  }
}
