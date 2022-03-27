import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  share,
  shareReplay,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Schedule, WeeklySchedulesInterface } from '../utils/types.utils';
import { AuthService } from './auth.service';
import { CalendarService } from './calendar.service';

type WeekScheduleMapType = Record<string, Array<Schedule>>;

@Injectable({
  providedIn: 'root',
})
export class WeekSchedulerService implements OnDestroy {
  private dates: Date[] = [];
  private weekScheduleMap: WeekScheduleMapType = {};
  subscription: Subscription;

  private weekScheduleMapSubject: BehaviorSubject<WeekScheduleMapType>;
  weekSchedules$: Observable<WeekScheduleMapType>;

  private updateStateSubject: Subject<void> = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private calendarService: CalendarService,
    private authService: AuthService
  ) {
    this.weekScheduleMapSubject = new BehaviorSubject<WeekScheduleMapType>({});
    this.weekSchedules$ = this.weekScheduleMapSubject.asObservable();

    this.subscription = this.calendarService.calenderWeek$.subscribe(
      (dates) => {
        this.dates = [...dates];
      }
    );

    this.updateStateSubject.subscribe(() => this.getSchedules());
  }

  refreshState() {
    this.updateStateSubject.next();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.warn('WeekScheduler Service Died...');
  }

  createSchedule(createSchedule: Partial<Schedule>) {
    return this.http
      .post(`/api/schedules/create`, createSchedule)
      .pipe(tap(() => this.refreshState()));
  }

  getSchedules() {
    const { startDate, endDate } = this.getStartAndEndDate();

    return this.http
      .get(`/api/schedules/find-by-week`, {
        params: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        },
      })
      .pipe(shareReplay())
      .subscribe({
        next: (response: Partial<WeeklySchedulesInterface>) => {
          if (response.data) {
            this.weekScheduleMap = {}; // CLEARS OUT BUFFER
            response.data.forEach((object) => {
              this.weekScheduleMap[object.date] = [...object.schedules];
            });
            this.weekScheduleMapSubject.next({ ...this.weekScheduleMap });
            console.log(`[Refreshed]: Schedules Refreshed!`);
          }
        },
        error: (error) => {
          console.error(`Error was: ${error.error}`);
          this.authService.logout();
          window.location.replace('/');
        },
      });
  }

  updateSchedule(updatedSchedule: Partial<Schedule>) {
    const { _id, colorCode, ...payload } = updatedSchedule;
    return this.http
      .patch(
        `/api/schedules/update`,
        { ...payload, colorCode: String(colorCode) },
        {
          params: { id: _id as string },
        }
      )
      .pipe(
        share(),
        tap(() => {
          this.refreshState();
        })
      );
  }

  deleteSchedule(schedule: Partial<Schedule>) {
    const { _id } = schedule;
    return this.http
      .delete(`/api/schedules/delete`, {
        params: { id: _id as string },
      })
      .pipe(
        share(),
        tap(() => {
          this.refreshState();
        })
      );
  }

  updateScheduleDatebyId(scheduleId: string, dateTobePushed: Date) {
    return this.http
      .patch(
        `/api/schedules/update-date`,
        { newDate: dateTobePushed },
        {
          params: { id: scheduleId },
        }
      )
      .pipe(
        share(),
        tap(() => {
          this.refreshState();
        })
      );
  }

  private getStartAndEndDate() {
    return {
      startDate: this.dates[0],
      endDate: this.dates[this.dates.length - 1],
    };
  }
}
