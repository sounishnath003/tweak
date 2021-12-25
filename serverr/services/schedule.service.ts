import { Request } from "express";
import createHttpError from "http-errors";
import { Model } from "mongoose";
import { ScheduleSchema } from "../utils/database/schedule.schema";
import { ScheduleInterface } from "../utils/interfaces";
import { ScheduleEditInterface } from "../utils/interfaces/schedule.interface";

type ScheduleServiceType = {
  schedule:
    | Model<typeof ScheduleSchema>
    | Array<Model<typeof ScheduleSchema>>
    | null;
  error: createHttpError.HttpError | null;
};

function getWeekRangeDates() {
  const weekStartDate: Date = new Date(
    new Date().setDate(new Date().getDate() - new Date().getDay() + 1)
  );
  const weekEndDate: Date = new Date(
    new Date().setDate(weekStartDate.getDate() + 6)
  );

  return { weekStartDate, weekEndDate };
}

export class ScheduleService {
  static async getSchedulesForCurrentWeek(
    req: Request
  ): Promise<ScheduleServiceType> {
    try {
      const { weekStartDate, weekEndDate } = getWeekRangeDates();

      const schedules = await ScheduleSchema.find({
        date: { $gte: weekStartDate, $lte: weekEndDate },
      });

      return { schedule: schedules, error: null };
    } catch (error: any) {
      return { schedule: null, error: error.message };
    }
  }
  public static async createNewSchedule(
    payload: Partial<ScheduleInterface>
  ): Promise<ScheduleServiceType> {
    try {
      console.log({ payload });
      const schedule = new ScheduleSchema(payload);
      await schedule.save();

      return { schedule, error: null };
    } catch (error: any) {
      return { schedule: null, error: createHttpError("401", error.message) };
    }
  }

  public static async updateSchedule(
    payload: ScheduleEditInterface
  ): Promise<ScheduleServiceType> {
    try {
      const { _id, username, ...rest } = payload;
      const schedule = await ScheduleSchema.findOneAndUpdate(
        { _id, username },
        rest as any,
        { new: true }
      );
      console.log({ schedule });

      await schedule.save();

      return { schedule, error: null };
    } catch (error: any) {
      return { schedule: null, error: createHttpError("401", error.message) };
    }
  }
}
