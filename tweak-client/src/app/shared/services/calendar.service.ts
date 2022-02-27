import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum WeekGenerationType {
  CURRENT = '[CURRENT]',
  PAST_WEEK = '[PAST_WEEK]',
  NEXT_WEEK = '[NEXT_WEEK]',
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly currentWeekStartDate: Date = new Date(
    new Date().setDate(new Date().getDate() - new Date().getDay() + 1)
  ); // new Date();

  private weekStartDate: Date = new Date(
    new Date().setDate(new Date().getDate() - 0)
  );
  private weekEndDate: Date = new Date(
    new Date().setDate(this.currentWeekStartDate.getDate() + 6)
  );
  private readonly MONTHS_MAPPING = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private monthWithYearSubject: BehaviorSubject<string>;
  public monthWithYear$: Observable<string>;

  private calendarWeekSubject: BehaviorSubject<Array<Date>>;
  public calenderWeek$: Observable<Array<Date>>;

  constructor() {
    this.calendarWeekSubject = new BehaviorSubject<Array<Date>>(
      this.generateDatesForCurrentWeek()
    );
    this.calenderWeek$ = this.calendarWeekSubject.asObservable();

    this.monthWithYearSubject = new BehaviorSubject(
      this.getCurrentMonthWithYear()
    );
    this.monthWithYear$ = this.monthWithYearSubject.asObservable();
  }

  public generateWeekDates(type: WeekGenerationType) {
    if (type === WeekGenerationType.CURRENT) {
      this.calendarWeekSubject.next(this.generateDatesForCurrentWeek());
    } else if (type === WeekGenerationType.NEXT_WEEK) {
      this.calendarWeekSubject.next(this.generateNextWeekDates());
    } else {
      this.calendarWeekSubject.next(this.generatePastWeekDates());
    }
  }

  private generateNextWeekDates() {
    this.weekStartDate = this.weekEndDate;

    const weekStartsAt = new Date(
      this.weekEndDate.setDate(this.weekEndDate.getDate() + 1)
    );

    const dates: Array<Date> = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(weekStartsAt);
      dd.setDate(dd.getDate() + i);
      dates.push(dd);
    }

    this.weekStartDate = dates[0];
    this.weekEndDate = dates[6];

    this.monthWithYearSubject.next(this.getCurrentMonthWithYear());

    this.calendarWeekSubject.next(dates);
    return dates;
  }

  private generatePastWeekDates() {
    const weekStartsAt = new Date(
      this.weekStartDate.setDate(
        this.weekStartDate.getDate() - this.weekStartDate.getDay() + 1
      )
    );

    const dates: Array<Date> = [];

    for (let i = 7; i >= 1; i--) {
      const dd = new Date(weekStartsAt);
      dd.setDate(dd.getDate() - i);
      dates.push(dd);
    }

    this.weekStartDate = dates[0];
    this.weekEndDate = dates[6];

    this.monthWithYearSubject.next(this.getCurrentMonthWithYear());

    this.calendarWeekSubject.next(dates);
    return dates;
  }

  private generateDatesForCurrentWeek() {
    const dates: Array<Date> = [];
    for (let i = 0; i < 7; i++) {
      dates.push(this.getDate(i));
    }
    return dates;
  }

  private getDate(inc = 0) {
    const d = new Date();
    d.setDate(this.currentWeekStartDate.getDate() + inc);
    return d;
  }

  private getCurrentMonth(): string {
    const monthIndex: number = this.weekStartDate.getMonth();
    return this.MONTHS_MAPPING[monthIndex];
  }

  public getCurrentMonthWithYear(): string {
    const month = this.getCurrentMonth();
    const year = new Date().getFullYear();
    return `${month} ${year}`;
  }
}
