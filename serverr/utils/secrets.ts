import { scryptSync } from "crypto";
import environment from "dotenv";
import { UserInterface } from "./interfaces";
environment.config();

export const MONGO_DB_URL = process.env.DATABASE_URL || "";
export const JWT_TOKEN = process.env.JWT_TOKEN || "";

export function generateHash(password: string) {
  return scryptSync(password, JWT_TOKEN, 64).toString("hex");
}

export function generateAuthToken(user: UserInterface): string {
  return `${user.username}#${generateHash(user.username)}#${Date.now()}`; // [id,token,datetimenow]
}

export const cookieOptions = {
  secure: false,
  sameSite: true,
  expires: new Date(Date.now() + 1000 * 3600 * 24),
};
