import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
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

  monthWithYear$: BehaviorSubject<string> = new BehaviorSubject(
    this.getCurrentMonthWithYear()
  );

  constructor() {}

  /**
   * generateNextWeekDates
   */
  public generateNextWeekDates() {
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

    this.monthWithYear$.next(this.getCurrentMonthWithYear());

    return dates;
  }

  /**
   * generatePastWeekDates
   */
  public generatePastWeekDates() {
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

    this.monthWithYear$.next(this.getCurrentMonthWithYear());

    return dates;
  }

  /**
   * generateDatesForPastWeek
   */
  public generateDatesForPastWeek() {
    const dates: Array<Date> = [];
    for (let i = 7; i >= 1; i--) {
      dates.push(this.getDate(-i));
    }
    return dates;
  }

  /**
   * generateDatesForCurrentWeek
   */
  public generateDatesForCurrentWeek() {
    const dates: Array<Date> = [];
    for (let i = 0; i < 7; i++) {
      dates.push(this.getDate(i));
    }
    return dates;
  }

  /**
   * getDate
   */
  public getDate(inc = 0) {
    const d = new Date();
    d.setDate(this.currentWeekStartDate.getDate() + inc);
    return d;
  }

  /**
   * getCurrentMonth
   */
  public getCurrentMonth(): string {
    const monthIndex: number = this.weekStartDate.getMonth();
    return this.MONTHS_MAPPING[monthIndex];
  }

  /**
   * getCurrentMonthWithYear
   */
  public getCurrentMonthWithYear(): string {
    const month = this.getCurrentMonth();
    const year = this.weekStartDate.getFullYear();
    return `${month} ${year}`;
  }
}
