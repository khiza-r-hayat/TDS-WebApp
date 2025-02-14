import { User } from "app/core/user/user.types";
import { UserModel } from "./account.model";

export interface UserSession {
  userId: string;
  user?: UserModel;
}

export interface UserSessionModel {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  impersonatedId: string;
  organizationId: string;
  tenantId: string;
  impersonatedAs?: UserModel;
  user?: UserModel;
}

export interface UserSessionUpload {
  id: string;
  userId: string;
  expiresAt: Date;
  tenantId: string;
  organizationId: string;
  impersonatedId?: string;
}

export interface LocalSession {
  user: User;
  token:string;
  tokenType:string;
}
