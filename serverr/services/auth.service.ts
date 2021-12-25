import createHttpError from "http-errors";
import { Model } from "mongoose";
import { UserSchema } from "../utils/database/user.schema";
import { UserInterface } from "../utils/interfaces";
import { generateHash } from "../utils/secrets";

type AuthType = Promise<{
  user: Model<typeof UserSchema> | null;
  error: null | createHttpError.HttpError;
}>;

export class AuthService {
  static async signupWithUsernameAndPassword(payload: UserInterface): AuthType {
    try {
      const isUser = await UserSchema.findOne({ username: payload.username });
      if (isUser) {
        throw new Error(
          "Username already taken!. Instead please login into your account"
        );
      }

      const hashedPassword: string = generateHash(payload.password);
      payload.password = hashedPassword;
      const user = new UserSchema(payload);
      await user.save();
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: createHttpError(401, error.message) };
    }
  }
  static async login(payload: UserInterface): AuthType {
    try {
      // call database to login validation using MongoDB
      const user = await UserSchema.findOne({ username: payload.username });
      if (!user) {
        throw new Error("Invalid username!. Username not found!");
      }

      // check password
      const isPasswordValid: boolean = await user.validatePassword(payload.password);
      if (!isPasswordValid) {
        throw new Error("Password incorrect! Please enter valid password");
      }

      // setup cookie

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: createHttpError(401, error.message) };
    }
  }
}
