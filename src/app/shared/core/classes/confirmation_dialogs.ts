import { FuseConfirmationService } from "@fuse/services/confirmation";
import { CONSTANTS } from "./utility";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root", // 'root' makes it a singleton service available app-wide
})
export class ConfirmationDialogs {
  constructor(private _fuseConfirmationService: FuseConfirmationService) {} // 'root' makes it a singleton service available app-wide

  confirmDelete(entityName: string, multiple: boolean) {
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete ${entityName}`,
      message: `Are you sure you want to delete ${
        multiple ? `selected ${entityName}s` : `this ${entityName}`
      }?`,
      actions: {
        confirm: {
          label: CONSTANTS.DELETE,
        },
      },
    });
    return confirmation;
  }
  
  confirmDisable(entityName: string, multiple: boolean) {
    const confirmation = this._fuseConfirmationService.open({
      title: `Disable ${entityName}`,
      message: `Are you sure you want to disable ${
        multiple ? `selected ${entityName}s` : `this ${entityName}`
      }?`,
      actions: {
        confirm: {
          label: CONSTANTS.DISABLE,
        },
      },
    });
    return confirmation;
  }
  
  confirmApproval(entityName: string, multiple: boolean) {
    const confirmation = this._fuseConfirmationService.open({
      title: `Approve ${entityName}`,
      message: `Are you sure you want to approve ${
        multiple ? `selected ${entityName}s` : `this ${entityName}`
      }?`,
      icon: {
        color: "primary",
      },
      actions: {
        confirm: {
          label: CONSTANTS.APPROVE,
          color: "primary",
        },

      },
    });
    return confirmation;
  }
}
