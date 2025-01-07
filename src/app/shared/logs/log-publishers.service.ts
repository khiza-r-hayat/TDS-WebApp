import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";

import { LogPublisher, LogConsole, LogWebApi } from "./log-publishers";
import { environment } from "environments/environment";

@Injectable({ providedIn: "root" })
export class LogPublishersService {
  constructor(private apollo: Apollo) {
    // Build publishers arrays
    this.buildPublishers();
  }

  publishers: LogPublisher[] = [];

  // Build publishers array
  buildPublishers(): void {
    if (environment.apiLog) this.publishers.push(new LogWebApi(this.apollo));
    // Create instance of `LogWebApi` Class
    else this.publishers.push(new LogConsole()); // Create instance of LogConsole Class
  }
}
