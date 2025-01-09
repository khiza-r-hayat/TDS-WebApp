import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { FilterUtils } from '../../classes/filter_utils';
import { MessageService } from '../../classes/message.service';
import { AccountMapper } from '../../data/api/account/account.mapper';
import { RoleMapper } from '../../data/api/account/role.mapper';
import { AccountModel, Roles, UserModel } from '../models/account.model';
import { AccountRepository } from '../repository/account.repository';
import { UserSessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
    // Private signals
    private _account = signal<UserModel | null>(null);
    // private _loggedInAccount = signal<UserModel | null>(null);
    private _accounts = signal<UserModel[]>([]);
    private _sponsorStaff = signal<UserModel[]>([]);
    private _roles = signal<Roles[]>([]);

    private api = inject(AccountRepository);
    // private logger = inject(LogService);
    private messageService = inject(MessageService);
    private sessionService = inject(UserSessionService);

    private accountMapper = new AccountMapper();
    private roleMapper = new RoleMapper();
    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for account
     */
    get account() {
        return this._account;
    }

    /**
     * Getter for accounts
     */
    get accounts() {
        return this._accounts;
    }
    /**
     * Getter for accounts
     */
    get sponsorStaff() {
        return this._sponsorStaff;
    }
    /**
     * Getter for roles
     */
    get roles() {
        return this._roles;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Get methods
    // -----------------------------------------------------------------------------------------------------

    getAccounts(): Observable<UserModel[]> {
        return this.api.getAccounts().pipe(
            catchError((e) => {
                console.log('Error fetching users', e);
                this.messageService.errorMessage(`Failed to fetch users!`);
                return of(null);
            }),
            tap((response: any) => {
                if (response) {
                    console.log('Fetched users successfuly');
                    // const userId = this._loggedInAccount().id;
                    // const userId = this.sessionService.userSession().user.id;

                    const users = response.data['user'];
                    // .filter((a) => a.id !== userId)
                    // .map((e) => this.accountMapper.mapFrom(e));

                    const roles = response.data['role'].map((e) =>
                        this.roleMapper.mapFrom(e)
                    );

                    this._accounts.set(users);
                    this._roles.set(roles);
                }
            })
        );
    }

    getAccountsByRoles(roles: number[]): Observable<AccountModel[]> {
        return this.api.getAccountsByRoles(roles).pipe(
            catchError((e) => {
                console.log('Error fetching users', e);
                this.messageService.errorMessage(`Failed to fetch users!`);
                return of(null);
            }),
            tap((response: any) => {
                if (response) {
                    console.log('Fetched users successfuly');
                    // const userId = this._loggedInAccount().id;
                    const userId = this.sessionService.userSession().user.id;

                    const users = response.data['user']
                        .filter((a) => a.id !== userId)
                        .map((e) => this.accountMapper.mapFrom(e));

                    const roles = response.data['role'].map((e) =>
                        this.roleMapper.mapFrom(e)
                    );

                    this._accounts.set(users);
                    this._roles.set(roles);
                }
            })
        );
    }

    getAccountById(id: string): Observable<UserModel[]> {
        return this.api.getAccountById(id).pipe(
            catchError((e) => {
                console.log('Error fetching user', e, id);
                this.messageService.errorMessage(`Failed to fetch user!`);
                return of(null);
            }),
            tap((response: UserModel[]) => {
                if (response && response.length > 0) {
                    console.log('Fetched user successfuly', id);
                    this._account.set(response[0]);
                }
                return of(null);
            })
        );
    }

    getAccountByEmail(email: string): Observable<UserModel[]> {
        return this.api.getAccountByEmail(email).pipe(
            catchError((e) => {
                console.log('Error fetching user by email', e, email);
                this.messageService.errorMessage(`Failed to fetch user!`);
                return of(null);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Filter methods
    // -----------------------------------------------------------------------------------------------------

    applyFilters(
        query: string,
        tenantId: string,
        sponsorId: string,
        roleId: number
    ): UserModel[] {
        let accounts = this.accounts();
        if (query !== '') {
            accounts = FilterUtils.filterArrayByQuery(accounts, query);
        }
        if (roleId !== 0) {
            accounts = accounts.filter((a) => a.roleId === roleId);
        }

        return accounts;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Post methods
    // -----------------------------------------------------------------------------------------------------

    updateAccounts(accounts: UserModel[]): Observable<any> {
        return this.api.addAccounts(accounts).pipe(
            catchError((e) => {
                console.log('Error:Updating users ', e);
                this.messageService.errorMessage(
                    `Failed to upload ${accounts.length === 1 ? 'user' : 'users'}!`
                );
                return of(null);
            }),
            map((res: UserModel[]) => {
                if (res) {
                    console.log(
                        `Added ${accounts.length} ${
                            accounts.length === 1 ? 'user' : 'users'
                        } successfuly!`
                    );

                    this.updateAccountssLocally(res);
                }
                return res;
            })
        );
    }

    updateAccountssLocally(accountsUpdate: UserModel[]) {
        let accounts: UserModel[] = [...this.accounts()];

        for (let account of accountsUpdate) {
            const index = accounts.findIndex((s) => s.id == account.id);
            if (index !== -1) {
                accounts[index] = account;
            } else {
                accounts.push(account);
            }
        }
        this._accounts.set(accounts);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Delete methods
    // -----------------------------------------------------------------------------------------------------

    removeSelectedAccounts(accounts: UserModel[]) {
        const ids = accounts.map((a) => a.id);
        this.api
            .deleteAccounts(ids)
            .pipe(
                catchError((e) => {
                    console.log('Error deleting accounts', e);
                    this.messageService.errorMessage(
                        `Error deleting ${ids.length === 1 ? 'account' : 'accounts'}`
                    );
                    return of(null);
                })
            )
            .subscribe((res) => {
                if (res) {
                    const accountsFiltered = this._accounts().filter(
                        (v) => !accounts.some((a) => a.id === v.id)
                    );
                    this._accounts.set(accountsFiltered);
                }
            });
    }
}
