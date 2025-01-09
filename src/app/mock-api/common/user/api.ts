import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { UserService } from 'app/core/user/user.service';
import { user as userData } from 'app/mock-api/common/user/data';
import { assign, cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class UserMockApi {
    private _user: any = userData;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _userService: UserService
    ) {
        this._userService.user$.subscribe((user) => {
            this._user.id = user.id;
            this._user.email = user.email;
            this._user.name = user.name;
            this._user.avatar = user.avatar;
            this._user.roleId = user.roleId;
        });
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(() => [200, cloneDeep(this._user)]);

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({ request }) => {
                // Get the user mock-api
                const user = cloneDeep(request.body.user);

                // Update the user mock-api
                this._user = assign({}, this._user, user);

                // Return the response
                return [200, cloneDeep(this._user)];
            });
    }
}
