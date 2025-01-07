import { UserRole } from '../../classes/roles';
import { Utility } from '../../classes/utility';
import {
    AccountModel,
    AccountUpload,
    UserModel,
} from '../models/account.model';

export class AccountHelper {
    public static mapFromAccountUploadToAccountModel(
        update: AccountUpload,
        previousAccount?: AccountModel
    ): AccountModel {
        return {
            id: update.id,
            firstName: update.firstName,
            lastName: update.lastName,
            email: update.email,
            gender: '',
            phone: '',
            picture: update.pictureUrl,
            status: update.status,
            isSuperAdmin: false,
            roleId: update.roleId,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: update.createdBy,
            organizationId: update.organizationId,
            companyRoles: this.getRoles(
                previousAccount,
                update,
                'companyRoles'
            ),
            tenantRoles: this.getRoles(previousAccount, update, 'tenantRoles'),
        };
    }

    public static getRoles(account: AccountModel, upload: AccountUpload, key) {
        let data = [];
        if (account && account[key]) {
            data = [...account[key]];
        }
        if (upload[key]) {
            data.push(upload[key]['data']);
        }
        return data.length ? data : null;
    }

    public static roleHasAccess(id, roles: number[]) {
        return roles.some((r) => r === id);
    }

    public static getUploadableAccount(
        data: any,
        editMode: boolean,
        userId: string,
        account: UserModel,
        pictureUrl: string
    ): UserModel {
        const id = editMode ? account.id : Utility.generateUUID();
        return {
            id: id,
            title: data.title,
            email: data.email,
            photo: pictureUrl ? pictureUrl : account?.phone ?? '',
            active: true,
            roleId: data.role.id,
            createdBy: userId,
            isSuperAdmin: data.role.id === UserRole.SUPER_ADMINISTRATOR,
            phone: data.phone,
        };
    }
}
