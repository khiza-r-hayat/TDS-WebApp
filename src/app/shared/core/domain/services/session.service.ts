import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { SessionMapper } from '../../data/api/session/session.mapper';
import {
    UserSession,
    UserSessionModel,
    UserSessionUpload,
} from '../models/session.model';
import { SessionRepository } from '../repository/session.repository';
import { UserModel } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
    private _session = signal<UserSessionModel>(null);
    private _userSession = signal<UserSession>(null);

    private api = inject(SessionRepository);
    // private _accountService = inject(AccountService);
    // private logger = inject(LogService);
    private mapper = new SessionMapper();

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get session() {
        return this._session;
    }

    get userSession() {
        return this._userSession;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    updateUserSession(session: UserSession) {
        this.userSession.update(() => session);
        console.log('updated session: ', this.userSession());
    }

    /**
     * Get the current signed-in user session data by userId
     */

    getUserSession(id: string): Observable<UserSessionModel[]> {
        return this.api.getUserSession(id).pipe(
            catchError((e) => {
                console.log('Error fetching user session ', e);
                return of(null);
            })
        );
    }

    /**
     * Get the current signed-in user session data
     */
    getUserSessionById(id: string): Observable<UserSessionModel> {
        return this.api.getSessionById(id).pipe(
            catchError((e) => {
                console.log('Error fetching user session ', e);
                return of(null);
            }),
            map((res) => {
                this.session.set(res[0]);
                // this._accountService.setLoggedInUser(res[0].user);
                return res[0];
            })
        );
    }

    /**
     * Create user session
     *
     * @param user
     */
    createUserSession(
        session: UserSessionUpload,
        user: UserModel,
        impersonatedAs?: UserModel,
        impersonatedId?: string
    ): Observable<any> {
        return this.api.createUserSession(session).pipe(
            catchError((e) => {
                console.log('Error creating user session ', e);
                return of(null);
            }),
            switchMap((res) => {
                if (res) {
                    let newSession = this.mapper.mapTo(session);
                    newSession.user = user;
                    newSession.impersonatedAs = impersonatedAs;
                    newSession.impersonatedId = impersonatedId;
                    this._session.set(newSession);
                    // this._accountService.setLoggedInUser(user);
                }
                return res;
            })
        );
    }

    expireUserSession(id: string): Observable<UserSessionModel[]> {
        return this.api.expireUserSession(id).pipe(
            catchError((e) => {
                console.log('Error fetching user session ', e);
                return of(null);
            })
        );
    }
}
