import { Observable, map, of, retry } from "rxjs";
import { LogEntry } from "./log-entry.class";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/functions.graphql";

import { environment } from "environments/environment";

// Log Publisher Abstract Class
export abstract class LogPublisher {
  location: string;

  abstract log(record: LogEntry): Observable<any>;
  abstract clear(): Observable<boolean>;
}

// Console Logging Class
export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    // Log to console
    console.log(entry.buildLogString());

    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();

    return of(true);
  }
}

// Webapi Logging Class for hasura
export class LogWebApi extends LogPublisher {
  constructor(private apollo: Apollo) {
    super();

    this.location = "/api/logging";
  }

  log(entry: LogEntry): Observable<any> {
    return this.apollo
      .subscribe<boolean>({
        query: Query.logAction,
        variables: {
          request: {
            name: environment.logName,
            message: entry.message,
            level: this.getLogLevel(entry.level),
            body: {
              userId:
                entry.userInfo && entry.userInfo.id
                  ? entry.userInfo.id.toString()
                  : "",
              email:
                entry.userInfo && entry.userInfo.email
                  ? entry.userInfo.email
                  : "",
              additionalData: entry.buildLogString(),
              clientSideData: navigator.userAgent,
              appVersion: environment.appVersion,
              scanCode: "",
              impersonatedLevel1: entry.impersonatedLevel1,
              impersonatedLevel2: entry.impersonatedLevel2,
            },
          },
        },
      })
      .pipe(map((item) => item.data));
  }

  clear(): Observable<boolean> {
    // TODO: Call Web API to clear all values
    return of(true);
  }

  getLogLevel(level: number): string {
    let severity: string = "info";

    switch (level) {
      case 0:
        severity = "info";
        break;
      case 1:
        severity = "debug";
        break;
      case 2:
        severity = "info";
        break;
      case 3:
        severity = "warn";
        break;
      case 4:
        severity = "error";
        break;
      default:
        severity = "info";
        break;
    }

    return severity;
  }
}
