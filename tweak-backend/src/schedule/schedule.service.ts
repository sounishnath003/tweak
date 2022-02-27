import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
  ) {}

  async create(
    createScheduleDto: CreateScheduleDto,
  ): Promise<{ data: string } | Error> {
    try {
      const scheduleDoc = new this.scheduleModel(createScheduleDto);
      await scheduleDoc.save();
      return { data: 'schedule created!' };
    } catch (error) {
      return error;
    }
  }

  async findAll(user: User) {
    const schedules = await this.scheduleModel
      .find({ username: user.username })
      .sort([
        ['date', 'desc'],
        ['createdAt', 'desc'],
      ])
      .exec();

    return { data: await this.generateScheduleRecordByDates(schedules) };
  }

  async findByWeek(user: User, from: Date, to: Date) {
    const mfrom = new Date(from).toDateString();
    const mto = new Date(to).toDateString();

    const schedules = await this.scheduleModel
      .where({
        username: user.username,
        date: { $gte: mfrom, $lte: mto },
      })
      .sort([['date', 'desc']]);

    return { data: await this.generateScheduleRecordByDates(schedules) };
  }

  async findOne(id: string) {
    return { data: await this.scheduleModel.findById(id) };
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    await this.scheduleModel.findOneAndUpdate({ _id: id }, updateScheduleDto);
    return { data: `schedule ${id} has been updated` };
  }

  async remove(id: string) {
    await this.scheduleModel.findByIdAndRemove(id);
    return { data: `schedule ${id} has been removed!` };
  }

  // PRIVATE METHODS

  private async generateScheduleRecordByDates(
    schedules: (import('mongoose').Document<unknown, any, ScheduleDocument> &
      User &
      Document & { _id: import('mongoose').Types.ObjectId })[],
  ) {
    /**
     * create a HashMap
     *  data: [
     *   {
     *     date: "2022-02-23",
     *     schedules: [
     *       {...},
     *       {...},
     *       {...},
     *     ]
     *   }
     * ]
     */
    const data: Record<string, Array<Schedule>> = {};
    schedules.forEach((schedule: any) => {
      const date = schedule.date.toDateString();
      if (date in data) {
        data[date].push(schedule);
      } else {
        data[date] = [schedule];
      }
    });

    let payload = [];
    Object.keys(data).forEach((key: string) => {
      payload.push({ date: key, schedules: [...data[key]] });
    });

    return payload;
  }
}
