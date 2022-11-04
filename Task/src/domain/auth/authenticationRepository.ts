import { JwtPayload } from "jsonwebtoken";
import { Token } from "../token/model";
import { Admin } from "./model";

export interface IAuthenticationRepository {
  comparePassword(password: string, dbPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  createAdminToken(admin: Admin): Promise<Token>;
  verifyToken(token: string, secret: string): Promise<JwtPayload>;
  registerAdmin(admin: IRegisterAdminDto): Promise<Admin>;
  getAdminByEmail(email: string): Promise<Admin>;
  getAdminInfo(): Promise<Admin>;
}

export interface IRegisterAdminDto {
  fullname: string;
  email: string;
  password: string;
}
