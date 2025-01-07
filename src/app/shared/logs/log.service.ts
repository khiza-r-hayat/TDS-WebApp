import { Inject, Injectable, signal } from "@angular/core";
import { LogLevel } from "./log.model";
import { LogPublisher } from "./log-publishers";
import { LogPublishersService } from "./log-publishers.service";
import { LogEntry } from "./log-entry.class";
import { environment } from "environments/environment";
import { AccountModel } from "../core/domain/models/account.model";
import { AccountService } from "../core/domain/services/account.service";
import { CONSTANTS } from "../core/classes/utility";

@Injectable({ providedIn: "root" })
export class LogService {
  publishers: LogPublisher[];
  level: LogLevel = environment.logLevel;
  logWithDate: boolean = false;
  _loggedInUser: AccountModel;
  // private _accountService:AccountService = Inject(AccountService);
  //  private _userHelper: UserHelper
  //  private _localStorage: LocalStorageService
  constructor(private publishersService: LogPublishersService) {
    // Set publishers
    this.publishers = this.publishersService.publishers;
    // this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER, true);
    // this._loggedInUser = this._accountService.loggedInAccount();
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  clear(): void {
    for (let logger of this.publishers) {
      logger.clear().subscribe((response) => console.log(response));
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;

    if (
      (level >= this.level && level !== LogLevel.Off) ||
      this.level === LogLevel.All
    ) {
      ret = true;
    }

    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      //console.log(msg);
      let entry: LogEntry = new LogEntry();
      // if (this._loggedInUser?.isImpersate) {
      //     const { eventOrganizerUser, realUser } = this._userHelper.handleImpersonatedUsersLoging(this._loggedInUser);
      //     if (eventOrganizerUser && !realUser) {
      //         entry.userInfo = eventOrganizerUser;
      //         entry.impersonatedLevel1 = this._loggedInUser.email;
      //     } else if (!eventOrganizerUser && realUser) {
      //         entry.userInfo = realUser;
      //         entry.impersonatedLevel2 = this._loggedInUser.email;
      //     } else if (eventOrganizerUser && realUser) {
      //         entry.userInfo = realUser;
      //         entry.impersonatedLevel1 = eventOrganizerUser.email;
      //         entry.impersonatedLevel2 = this._loggedInUser.email;
      //     }
      // } else {
      // }
      
      entry.userInfo = JSON.parse(
        localStorage.getItem(CONSTANTS.LOGGED_IN_USER)
      );
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;
      for (let logger of this.publishers) {
        // log entry to google cloud logging using hasura action
        logger.log(entry).subscribe({
          next: (response) => {
            // Handle the response if needed
          },
          error: (error) => {
            // Handle the error
          },
        });
      }
    }
  }
}
