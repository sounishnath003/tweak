import { NextFunction, Request, Response, Router } from "express";
import { requiresAuth } from "../services/auth.middlewire";
import { AuthService } from "../services/auth.service";
import { UserInterface } from "../utils/interfaces";
import { cookieOptions, generateAuthToken } from "../utils/secrets";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: UserInterface = req.body;
      const { user, error } = await AuthService.signupWithUsernameAndPassword(
        payload
      );
      if (error) throw error;
      return res
        .status(200)
        .cookie("isAuthenticated", true, cookieOptions)
        .cookie(
          "authToken",
          generateAuthToken(user as unknown as UserInterface),
          cookieOptions
        )
        .send({
          data: { user, message: `user has been created`, success: true },
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: UserInterface = req.body;
      console.log({ loginPayload: payload });

      const { user, error } = await AuthService.login(payload);
      if (error) {
        throw error;
      }

      // if everything is ok, return the user
      return res
        .status(200)
        .cookie("isAuthenticated", true, cookieOptions)
        .cookie(
          "authToken",
          generateAuthToken(user as unknown as UserInterface),
          cookieOptions
        )
        .json({
          data: {
            message: "Login successful",
            username: (user as any).username,
            success: true,
          },
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/logout",
  requiresAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .clearCookie("isAuthenticated")
      .clearCookie("authToken")
      .send({
        data: {
          message: "you have been successfully logged out!",
          sucess: true,
        },
      });
  }
);

export default router;
