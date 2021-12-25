import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ScheduleObject {
  _id: string;
  __v?: number;
  username: string;
  todo: string;
  date: string;
  colorCode: number;
  finished: boolean;
}

export interface ScheduleEditObject extends ScheduleObject {
  _id: string;
  username: string;
}

export type Schedules = Array<ScheduleObject>;
export type SchedulesByDate = { [key: string]: Schedules };

@Injectable({
  providedIn: 'root',
})
export class WeeklyScheduleService {
  private scheduleByDates$: BehaviorSubject<SchedulesByDate> =
    new BehaviorSubject<SchedulesByDate>({});
  private works: Schedules = [];

  get schedulesByDatesOrder$(): Observable<SchedulesByDate> {
    return this.scheduleByDates$.asObservable();
  }

  getWorksByDate(date: Date): Schedules {
    return this.works.filter((work) => work.date === date.toDateString());
  }

  private refreshSubjectState(payload: ScheduleObject) {
    this.works.push(payload);
    const ss: SchedulesByDate = {};
    this.works.forEach((work: ScheduleObject) => {
      if (work.date in ss === false) {
        ss[work.date] = [{ ...work }];
      } else ss[work.date].push(work);
    });
    this.scheduleByDates$.next(ss);
  }

  createNewTodo(payload: ScheduleObject) {
    this.http
      .post('/api/schedules/create', payload, { withCredentials: true })
      .subscribe((response: any) => {
        this.refreshSubjectState({
          ...payload,
          __v: 0,
          _id: response.data._id,
          username: this.authService.getAuthState$.username as string,
        });
        console.log(`[ADDED]: ${JSON.stringify(payload)}`);
      });
  }

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.http.get<any>('/api/schedules/get-schedules/current-week').subscribe(
      (response: any) => {
        const schedules: Schedules = response.data.schedule;
        const ss: SchedulesByDate = {};
        schedules.forEach((work: ScheduleObject) => {
          work = { ...work, date: new Date(work.date).toDateString() };
          this.works.push(work);
          if (!ss[work.date]) {
            ss[work.date] = [work];
          } else ss[work.date].push(work);
        });
        this.scheduleByDates$.next(ss);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getSchedulesForDateRange(startDate: Date, endDate: Date) {
    this.http
      .get<any>(
        `/api/schedules/get-schedules/${this.formatDate(
          startDate
        )}/to/${this.formatDate(endDate)}`
      )
      .subscribe(
        (response) => {
          this.works = [];
          const schedules: Schedules = response.data.schedules;
          const ss: SchedulesByDate = {};
          schedules.forEach((work: ScheduleObject) => {
            work = { ...work, date: new Date(work.date).toDateString() };
            this.works.push(work);
            if (!ss[work.date]) {
              ss[work.date] = [work];
            } else ss[work.date].push(work);
          });
          this.scheduleByDates$.next(ss);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateSchedule(payload: ScheduleEditObject) {
    this.http
      .put(`/api/schedules/update/${payload._id}`, payload, {
        withCredentials: true,
      })
      .subscribe((response) => {
        const workObjectIndex = this.works.findIndex(
          (_work) => JSON.stringify(_work) === JSON.stringify(payload)
        );
        this.works[workObjectIndex] = { ...payload };
        const worksTemp = this.works;
        this.works = [];
        const ss: SchedulesByDate = {};
        worksTemp.forEach((work: ScheduleObject) => {
          work = { ...work, date: new Date(work.date).toDateString() };
          this.works.push(work);
          if (!ss[work.date]) {
            ss[work.date] = [work];
          } else ss[work.date].push(work);
        });
        this.scheduleByDates$.next(ss);
        console.log(`[UPDATED]: ${JSON.stringify(payload)}`);
      });
  }
}
