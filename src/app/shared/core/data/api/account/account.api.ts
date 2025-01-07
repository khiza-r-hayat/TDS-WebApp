import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/account.gql";
import { AccountRepository } from "app/shared/core/domain/repository/account.repository";
import { AccountMapper } from "./account.mapper";
import {
  AccountModel,
  AccountUpload,
  UserModel,
} from "app/shared/core/domain/models/account.model";
import { LogService } from "app/shared/logs/log.service";
import { UserMapper } from "./user.mapper";

@Injectable({
  providedIn: "root",
})
export class AccountAPI implements AccountRepository {
  private apollo = inject(Apollo);
  // private logger = inject(LogService);
  private mapper = new AccountMapper();
  private userMapper = new UserMapper();

  getAccounts(): Observable<any> {
    return this.apollo.subscribe<any[]>({
      query: Query.getAccountsQL,
    });
  }

  getAccountsByRoles(roles: number[]): Observable<any> {
    return this.apollo.subscribe<any[]>({
      query: Query.getAccountsByRolesQL,
      variables: {
        roles: roles,
      },
    });
  }

  getAccountById(id: string): Observable<UserModel> {
    return this.apollo
      .subscribe<AccountModel>({
        query: Query.getAccountByIdQL,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((result) => result.data["user"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getAccountByEmail(email: string): Observable<UserModel[]> {
    return this.apollo
      .subscribe<UserModel[]>({
        query: Query.getAccountByEmailQL,
        variables: {
          email: email,
        },
      })
      .pipe(
        map((result) => result.data["user"]),
        map((events) => events.map((event) => this.userMapper.mapFrom(event)))
      );
  }

  addAccounts(accounts: UserModel[]): Observable<any> {
    // const userIds = accounts.map((a) => a.id);
    return this.apollo
      .mutate<any>({
        mutation: Query.upsertAccountsQL,
        variables: { accounts: accounts},
      })
      .pipe(
        map((r) => (r ? r.data["insert_user"]["returning"] : of(null))),
        map((r) => r.map((e) => this.mapper.mapFrom(e)))
      );
  }

  deleteAccounts(ids: string[]): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: Query.deleteAccountsQL,
        variables: { ids: ids },
      })
      .pipe(map((r) => r.data));
  }
}
