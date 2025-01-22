import { inject, Pipe, PipeTransform } from "@angular/core";
import { AccountModel } from "app/shared/core/domain/models/account.model";
import { AccountService } from "app/shared/core/domain/services/account.service";

@Pipe({
  name: "rolenamepipe",
  standalone: true,
})
export class RoleNamePipe implements PipeTransform {
  private _accountService = inject(AccountService);
  transform(roleId: number): string {
    const roles = this._accountService.roles();
    return roles.find((r) => r.id == roleId).title ?? "";
  }
}
