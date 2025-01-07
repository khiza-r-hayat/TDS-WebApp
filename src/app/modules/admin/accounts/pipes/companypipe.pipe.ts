import { inject, Pipe, PipeTransform } from "@angular/core";
import { AccountModel } from "app/shared/core/domain/models/account.model";
import { SponsorService } from "app/shared/core/domain/services/sponsor.service";
import { TenantService } from "app/shared/core/domain/services/tenant.service";

@Pipe({
  name: "companynamepipe",
  standalone: true,
})
export class CompanyNamePipe implements PipeTransform {
  private _sponsorService = inject(SponsorService);
  private _tenantService = inject(TenantService);
  transform(account: AccountModel): string {
    let companyName: string = "";
    if (account.companyRoles && account.companyRoles.length) {
      let company = this._sponsorService.sponsors()
        ? this._sponsorService
            .sponsors()
            .find((s) => s.id === account.companyRoles[0].sponsorCompanyId)
        : null;
      if (company) {
        companyName = company.title;
      } else {
        companyName = account.companyRoles[0].sponsorCompany.title;
      }
    } else if (account.tenantRoles && account.tenantRoles.length) {
      let company = this._tenantService.tenants()
        ? this._tenantService
            .tenants()
            .find((t) => t.id === account.tenantRoles[0].tenantId)
        : null;
      if (company) {
        companyName = company.title;
      } else {
        companyName = account.tenantRoles[0].tenant.title;
      }
    }
    return companyName;
  }
}
