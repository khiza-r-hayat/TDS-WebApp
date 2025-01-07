import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import * as Query from "app/shared/core/graphql/session.gql";
import { SessionMapper } from "./session.mapper";
import { SessionRepository } from "app/shared/core/domain/repository/session.repository";
import { Utility } from "app/shared/core/classes/utility";
import {
  UserSessionModel,
  UserSessionUpload,
} from "app/shared/core/domain/models/session.model";

@Injectable({
  providedIn: "root",
})
export class SessionAPI implements SessionRepository {
  private apollo = inject(Apollo);
  mapper = new SessionMapper();

  createUserSession(session: UserSessionUpload): Observable<string> {
    return this.apollo
      .subscribe<any>({
        query: Query.createUserSessionQL,
        variables: {
          session: session,
        },
      })
      .pipe(map((result) => result.data["insert_user_session_one"]["id"]));
  }

  getUserSession(userId: string): Observable<UserSessionModel> {
    return this.apollo
      .subscribe<UserSessionModel>({
        query: Query.getUserSessionQL,
        variables: {
          id: userId,
        },
      })
      .pipe(
        map((result) => result.data["user_session"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  getSessionById(sessionId: string): Observable<UserSessionModel> {
    return this.apollo
      .subscribe<UserSessionModel>({
        query: Query.getSessionByIdQl,
        variables: {
          id: sessionId,
        },
      })
      .pipe(
        map((result) => result.data["user_session"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }

  expireUserSession(sessionId: string): Observable<UserSessionModel> {
    return this.apollo
      .subscribe<UserSessionModel>({
        query: Query.expireUserSessionQL,
        variables: {
          id: sessionId,
        },
      })
      .pipe(
        map((result) => result.data["user_session"]),
        map((events) => events.map((event) => this.mapper.mapFrom(event)))
      );
  }
}
