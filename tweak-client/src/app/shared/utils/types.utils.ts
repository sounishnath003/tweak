export interface WeeklySchedulesInterface {
  data: Datum[];
}

export interface Datum {
  date: string;
  schedules: Schedule[];
}

export interface Schedule {
  _id: string;
  username: string;
  finished: boolean;
  colorCode: number;
  date: Date;
  todo: string;
  createdAt: Date;
  __v: number;
}
