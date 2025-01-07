import { Observable } from "rxjs";
import { UserSessionUpload } from "../models/session.model";

export abstract class SessionRepository {
  abstract getUserSession(userId: string): Observable<any>;
  abstract getSessionById(sessionId: string): Observable<any>;
  abstract createUserSession(session: UserSessionUpload): Observable<any>;
  abstract expireUserSession(userId: string): Observable<any>;
}
