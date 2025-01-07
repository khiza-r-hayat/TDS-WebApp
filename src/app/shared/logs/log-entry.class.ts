import { AccountModel } from "../core/domain/models/account.model";
import { LogLevel } from "./log.model";

export class LogEntry {
  entryDate: Date = new Date();
  message: string = "";
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate: boolean = true;
  userInfo: AccountModel;
  impersonatedLevel1: string = "";
  impersonatedLevel2: string = "";

  // format message boday
  buildLogString(): string {
    let value: string = "";

    if (this.logWithDate) {
      value = new Date() + " - ";
    }
    value += "Type: " + LogLevel[this.level];
    value += " - Message: " + this.message;
    if (this.extraInfo.length) {
      value += " - Extra Info: " + this.formatParams(this.extraInfo);
    }

    return value;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(",");

    // Is there at least one object in the array?
    if (params.some((p) => typeof p == "object")) {
      ret = "";
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }
}
