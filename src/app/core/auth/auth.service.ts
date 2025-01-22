import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { UserModel } from 'app/shared/core/domain/models/account.model';
import { LocalSession } from 'app/shared/core/domain/models/session.model';
import { LocalStorageService } from 'app/shared/core/domain/services/local_storage.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../user/user.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _localStorageService = inject(LocalStorageService);
    private _fireAuth = inject(Auth);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set sessionObject(data: LocalSession) {
        this._localStorageService.set(environment.sessionKey, data);
    }

    get sessionObject(): LocalSession {
        return this._localStorageService.get(environment.sessionKey);
        // localStorage.getItem(environment.sessionKey)
        //   ? JSON.parse(localStorage.getItem(environment.sessionKey))
        //   : null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                const user = response.user as UserModel;
                const newUser: User = {
                    id: user.id,
                    avatar: user.photo,
                    name: user.title,
                    email: user.email,
                    roleId: user.roleId,
                };

                const session: LocalSession = {
                    user: newUser,
                    token: response.accessToken,
                    tokenType: response.tokenType,
                };

                this.sessionObject = session;

                // Store the user on the user service
                this._userService.user = newUser;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                session: this.sessionObject,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        const newSession: LocalSession = {
                            ...this.sessionObject,
                        };
                        newSession.token = response.accessToken;
                        this.sessionObject = newSession;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        try {
            // Remove the session from the local storage
            localStorage.removeItem(environment.sessionKey);

            this._fireAuth.signOut().then(() => {
                //window.alert('Logged out!');
            });

            // Set the authenticated flag to false
            this._authenticated = false;

            // Return the observable
            return of(true);
        } catch (error) {
            //window.alert('Error in Logged out!');
            this._authenticated = false;
            return of(true);
        }
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        phone: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                const user = response.user as UserModel;
                const newUser: User = {
                    id: user.id,
                    avatar: user.photo,
                    name: user.title,
                    email: user.email,
                    roleId: user.roleId,
                };

                const session: LocalSession = {
                    user: newUser,
                    token: response.accessToken,
                    tokenType: response.tokenType,
                };

                this.sessionObject = session;

                // Store the user on the user service
                this._userService.user = newUser;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.sessionObject) {
            this.signOut();
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.sessionObject.token)) {
            this.signOut();
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
