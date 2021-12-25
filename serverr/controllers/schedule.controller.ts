import { NextFunction, Request, Response, Router } from "express";
import { requiresAuth } from "../services/auth.middlewire";
import { ScheduleService } from "../services/schedule.service";
import { ScheduleSchema } from "../utils/database/schedule.schema";
import { ScheduleInterface } from "../utils/interfaces";
import { ScheduleEditInterface } from "../utils/interfaces/schedule.interface";

const router = Router();

router.get(
  "/get-schedules/current-week",
  requiresAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { schedule, error } =
        await ScheduleService.getSchedulesForCurrentWeek(req);
      if (error) throw new Error(error.message);

      return res.status(201).send({
        data: {
          schedule,
          success: true,
          message: "all schedules created for current week",
        },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/get-schedules/:startDate/to/:endDate",
  requiresAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const username = getUsername(req);
    const { startDate, endDate } = req.params;
    const schedules = await ScheduleSchema.find({
      username,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    return res.status(201).send({
      data: {
        schedules,
      },
    });
  }
);

router.post(
  "/create",
  requiresAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: Partial<ScheduleInterface> = {
        ...req.body,
        username: getUsername(req),
      };
      const { schedule, error } = await ScheduleService.createNewSchedule(
        payload
      );
      if (error) throw new Error(error.message);

      return res.status(201).send({
        data: {
          _id: (schedule as any)._id,
          message: `new schedule has been created`,
        },
      });
    } catch (error) {
      console.error({ error });
      next(error);
    }
  }
);

router.put(
  "/update/:scheduleId",
  requiresAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: ScheduleEditInterface = {
        ...req.body,
        username: getUsername(req),
      };
      const { schedule, error } = await ScheduleService.updateSchedule(
        payload
      );
      if (error) throw new Error(error.message);

      return res.status(201).send({
        data: {
          _id: (schedule as any)._id,
          message: `schedule has been updated`,
        },
      });
    } catch (error) {
      console.error({ error });
      next(error);
    }
  }
);

export default router;

function getUsername(req: Request): string {
  return (req as any).username;
}
