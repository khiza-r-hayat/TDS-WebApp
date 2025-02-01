import { Observable } from "rxjs";
import { UserModel } from "../models/account.model";

export abstract class AccountRepository {
  abstract getAccounts(): Observable<any[]>;
  abstract getAccountsByRoles(roles: number[]): Observable<any[]>;
  abstract getAccountById(id: string): Observable<UserModel[]>;
  abstract getAccountByEmail(id: string): Observable<UserModel[]>;
  abstract addAccounts(accounts: UserModel[]): Observable<any>;
  abstract deleteAccounts(ids: string[]): Observable<any>;
}
