import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';

enum RefresherType {
  'NEW_DATA' = '[NEW_DATA]',
  'REFRESH_STATE' = '[REFRESH_STATE]',
}

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
  scheduleByDates$: BehaviorSubject<SchedulesByDate> =
    new BehaviorSubject<SchedulesByDate>({});
  private works: Schedules = [];

  get schedulesByDatesOrder$(): Observable<SchedulesByDate> {
    return this.scheduleByDates$.asObservable();
  }

  getWorksByDate(date: Date): Schedules {
    return this.works.filter((work) => work.date === date.toDateString());
  }

  private refreshSubjectState(
    rtype: RefresherType,
    payload: ScheduleObject | Schedules
  ) {
    console.log(rtype);
    switch (rtype) {
      case RefresherType.NEW_DATA:
        {
          this.works.push({ ...payload } as ScheduleObject);
          const ss: SchedulesByDate = {};
          this.works.forEach((work: ScheduleObject) => {
            if (work.date in ss === false) {
              ss[work.date] = [{ ...work }];
            } else ss[work.date].push(work);
          });
          this.scheduleByDates$.next({ ...ss });
        }
        break;

      case RefresherType.REFRESH_STATE:
        {
          this.works = [];
          const ss: SchedulesByDate = {};
          [...(payload as Schedules)].forEach((work: ScheduleObject) => {
            work = { ...work, date: new Date(work.date).toDateString() };
            this.works.push(work);
            if (!ss[work.date]) {
              ss[work.date] = [work];
            } else ss[work.date].push(work);
          });
          this.scheduleByDates$.next(ss);
        }
        break;

      default:
        break;
    }
  }

  createNewTodo(payload: ScheduleObject) {
    this.http
      .post('/api/schedules/create', payload, { withCredentials: true })
      .pipe(
        catchError(() => {
          this.errorService.createAlert('Something went wrong while saving!');
          return of([]);
        })
      )
      .subscribe((response: any) => {
        this.refreshSubjectState(RefresherType.NEW_DATA, {
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
    private readonly authService: AuthService,
    private readonly errorService: ErrorService
  ) {
    this.http.get<any>('/api/schedules/get-schedules/current-week').subscribe({
      next: (response: any) => {
        const schedules: Schedules = response.data.schedule;
        this.refreshSubjectState(RefresherType.REFRESH_STATE, [...schedules]);
      },
      error: (error) => {
        this.authService
          .logout()
          .subscribe(() => console.log('[Logged out]! State'));
        this.errorService.createAlert(
          'you are not authenticated! Please login'
        );
      },
    });
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
      .pipe(
        catchError((error) => {
          console.error(error);
          this.authService
            .logout()
            .subscribe(() => console.log('[Logged out]! State'));
          this.errorService.createAlert(
            'Something went wrong. Failed to fetch your plans!'
          );
          return of([]);
        })
      )
      .subscribe((response) => {
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
      });
  }

  updateSchedule(payload: ScheduleEditObject) {
    this.http
      .put(`/api/schedules/update/${payload._id}`, payload, {
        withCredentials: true,
      })
      .subscribe((response) => {
        // const workObjectIndex = this.works.findIndex(
        //   (_work) => _work._id === payload._id
        // );
        // this.works[workObjectIndex] = { ...payload };
        // const worksTemp = [...this.works];
        // this.works = [];
        // const ss: SchedulesByDate = {};
        // worksTemp.forEach((work: ScheduleObject) => {
        //   work = { ...work, date: new Date(work.date).toDateString() };
        //   this.works.push(work);
        //   if (!ss[work.date]) {
        //     ss[work.date] = [{ ...work }];
        //   } else ss[work.date].push({ ...work });
        // });
        // console.log(ss);

        // this.scheduleByDates$.next({ ...ss });
        this.getUpdatedDataForCurrentWeek();
        console.log(`[UPDATED]: ${JSON.stringify(payload)}`);
      });
  }

  getUpdatedDataForCurrentWeek() {
    this.http.get<any>('/api/schedules/get-schedules/current-week').subscribe({
      next: (response: any) => {
        const schedules: Schedules = response.data.schedule;
        this.refreshSubjectState(RefresherType.REFRESH_STATE, [...schedules]);
      },
      error: (error) => {
        this.authService
          .logout()
          .subscribe(() => console.log('[Logged out]! State'));
        this.errorService.createAlert(
          'you are not authenticated! Please login'
        );
      },
    });
  }
}
