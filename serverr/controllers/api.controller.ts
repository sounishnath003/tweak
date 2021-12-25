import { NextFunction, Request, Response, Router } from "express";
import authController from "./auth.controller";
import scheduleController from "./schedule.controller";

const router = Router();

router.use("/data", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({
    timestamp: new Date(),
    ip: req.ip,
  });
});

router.use("/auth", authController);
router.use("/schedules", scheduleController);

export default router;