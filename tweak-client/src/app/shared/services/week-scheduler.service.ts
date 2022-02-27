import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subject,
  Subscription,
} from 'rxjs';
import { Schedule, WeeklySchedulesInterface } from '../utils/types.utils';
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
    private calendarService: CalendarService
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
      .subscribe((response: Partial<WeeklySchedulesInterface>) => {
        if (response.data) {
          response.data.forEach((object) => {
            this.weekScheduleMap[object.date] = [...object.schedules];
          });
          this.weekScheduleMapSubject.next(this.weekScheduleMap);
        }
      });
  }

  private getStartAndEndDate() {
    return {
      startDate: this.dates[0],
      endDate: this.dates[this.dates.length - 1],
    };
  }
}
