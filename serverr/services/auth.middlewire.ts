import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { generateHash } from "../utils/secrets";

export function requiresAuth(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated = req.cookies["isAuthenticated"];
  console.log({ isAuthenticated });

  if (isAuthenticated === "" || isAuthenticated === "false") {
    (req as any).isAuthenticated = false;
    next(createHttpError(401, "You are not authenticated!"));
  } else {
    const authToken: Array<string> = req.cookies["authToken"].split("#"); // [username, userIdHashcode, datetimenow]
    const hashedUserId = generateHash(authToken[0]);
    if (hashedUserId === authToken[1] && isAuthenticated === "true") {
      (req as any).isAuthenticated = true;
      (req as any).username = authToken[0];
    }
  }
  next();
}
