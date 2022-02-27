import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CalendarService } from '../shared/services/calendar.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-4 my-3">
      <app-header></app-header>
      <app-week-calender [weekDays]="dates"></app-week-calender>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dates: Array<Date> = [];
  subscriptions: Array<Subscription> = [];

  constructor(private calendarService: CalendarService) {
    this.registerSubscriptions(() =>
      this.calendarService.calenderWeek$.subscribe((dates) => {
        this.dates = dates;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subsciption) => subsciption.unsubscribe());
  }

  ngOnInit(): void {}

  registerSubscriptions(callback: Function) {
    return this.subscriptions.push(callback());
  }
}
