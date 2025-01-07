import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from '@angular/common';
import { Crypto } from './crypto.service';
import { LocalSession } from '../models/session.model';
// import { ModuleAccess, UserSessionModel } from '../../models/user.model';
// import { CONSTANTS } from './constant';
// import { Personnel, UserRole } from '../../models/personnel.model';
// import { Role, RoleAccess, UserRoleAccess } from '../../models/role.model';
// import { Position } from '../../models/position.model';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor(private router: Router, private location: Location) { }

    public set(key: string, value: object) {
        localStorage.setItem(key, Crypto.encryptData(value));
        console.log('item added')
    }

    get(key: string, flag: boolean = false): LocalSession {
        
        if(!localStorage.getItem(key)){
            return null;
        }

        const sessionData = Crypto.decryptData(localStorage.getItem(key));

        if (!sessionData) {
            if (!flag) {
                this.router.navigate(['/sign-out']);
            }
            return null;
        }

        return sessionData;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }

    // initiateUserSession(user: Personnel): UserSessionModel {

    //     let role: any;
    //     let roleLevel: any;
    //     let position: any;
    //     let transformedAccess: ModuleAccess[] = [];
    //     let userName = {
    //         'en': user.firstName['en'] + " " + user.lastName['en'],
    //         'ar': user.firstName['ar'] + " " + user.lastName['ar']
    //     }

    //     if (user.userRole.length > 0) {
    //         role = user.userRole[0].role;
    //         roleLevel = user.userRole[0].role.level;
    //     }

    //     if (user.userRole.length > 0) {
    //         const accessMap: Record<string, any> = {}; // To store the transformed access data

    //         user.userRole.forEach((roleObj) => {
    //             roleObj.role?.access.forEach((accessItem) => {
    //                 if (accessItem.device === 'cms') {
    //                     const moduleId = accessItem.moduleId;
    //                     const moduleName = accessItem.module?.name;

    //                     // If the moduleId is not already added, initialize it
    //                     if (!accessMap[moduleId]) {
    //                         accessMap[moduleId] = {
    //                             module: moduleName,
    //                             moduleAccess: {}
    //                         };
    //                     }

    //                     // Set the access action as true/false in moduleAccess
    //                     accessMap[moduleId].moduleAccess[accessItem.action] = accessItem.value;
    //                 }
    //             });
    //         });

    //         // Convert accessMap back to an array if needed
    //         transformedAccess = Object.keys(accessMap).map((moduleId) => ({
    //             moduleId,
    //             ...accessMap[moduleId],
    //         }));

    //         console.log(transformedAccess);
    //     }
    //     if (user.userPosition.length > 0) {
    //         position = user.userPosition[0].position;
    //     }

    //     let userSession: UserSessionModel = {
    //         id: user.id,
    //         roleId: role?.id,
    //         name: userName,
    //         positionId: position?.id,
    //         position: position?.name,
    //         role: role?.name,
    //         email: user.email,
    //         phone: user.phone,
    //         photo: user?.preview?.base ?? '',
    //         moduleAccess: transformedAccess,
    //         roleLevel: roleLevel,
    //         country: user.country,
    //         region: user.region,
    //         subRegion: user.subRegion,
    //         branch: user.branch,
    //     }
    //     return userSession;
    // }

    // getCurrentModuleAccess(moduleId: string): any {
    //     // Ensure _loggedInUser and moduleAccess are available
    //     let _currentUser = this.get(CONSTANTS.LOGGED_IN_USER);
    //     if (!_currentUser || !_currentUser.moduleAccess) {
    //         console.error("Logged-in user data or moduleAccess is missing");
    //         return null;
    //     }

    //     // Find the moduleAccess object for the given moduleId
    //     const currentModuleAccess = _currentUser.moduleAccess.find(
    //         (modAccess: any) => modAccess.moduleId === moduleId
    //     );

    //     if (!currentModuleAccess) {
    //         console.warn(`No access found for moduleId: ${moduleId}`);
    //         return null;
    //     }

    //     // Return the access details for the current module
    //     return currentModuleAccess.moduleAccess;
    // }

}