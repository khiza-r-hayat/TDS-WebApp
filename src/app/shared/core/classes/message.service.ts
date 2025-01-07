import { Injectable } from "@angular/core";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  constructor(private _fuseConfirmationService: FuseConfirmationService) {}

  successMessage(message: string) {
    this._fuseConfirmationService.open({
      title: "Success",
      message: message,
      actions: {
        confirm: {
          show: true,
          label: "OK",
          color: "primary",
        },
        cancel: {
          show: false,
          label: "No",
        },
      },
      icon: {
        show: true,
        name: "mat_outline:done_outline",
        color: "success",
      },
      dismissible: false,
    });
  }

  informationMessage(message: string) {
    this._fuseConfirmationService.open({
      title: "Information",
      message: message,
      actions: {
        confirm: {
          show: true,
          label: "OK",
          color: "primary",
        },
        cancel: {
          show: false,
          label: "No",
        },
      },
      icon: {
        show: true,
        name: "mat_outline:info",
        color: "info",
      },
      dismissible: false,
    });
  }

  warningMessage(message: string) {
    this._fuseConfirmationService.open({
      title: "Warning!",
      message: message,
      actions: {
        confirm: {
          show: true,
          label: "OK",
          color: "primary",
        },
        cancel: {
          show: false,
          label: "No",
        },
      },
      icon: {
        show: true,
        name: "mat_outline:warning_amber",
        color: "warning",
      },
      dismissible: false,
    });
  }

  errorMessage(message: string) {
    this._fuseConfirmationService.open({
      title: "Error!",
      message: message,
      actions: {
        confirm: {
          show: true,
          label: "OK",
          color: "primary",
        },
        cancel: {
          show: false,
          label: "No",
        },
      },
      icon: {
        show: true,
        name: "mat_outline:error",
        color: "warn",
      },
      dismissible: false,
    });
  }
}
