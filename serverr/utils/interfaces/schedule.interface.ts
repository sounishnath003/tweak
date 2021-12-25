export interface ScheduleInterface {
  id: string;
  todo: string;
  date: string;
  colorCode: number;
  finished: boolean;
  username: string;
}

export interface ScheduleEditInterface {
  _id: string;
  todo: string;
  date: string;
  colorCode: number;
  finished: boolean;
  username: string;
}
