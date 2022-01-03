import { Component, OnInit } from '@angular/core';
import { CalenderService } from '../services/calender.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-4 my-3">
      <app-header (onWeekToggle)="grabDates($event)"></app-header>
      <app-week-calender [weekDays]="dates"></app-week-calender>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dates: Array<Date> = this.getDatesForCurrentWeek();
  constructor(private calenderService: CalenderService) {}

  ngOnInit(): void {}

  public grabDates(payload: { dates: Array<Date> }) {
    this.dates = payload.dates;
  }

  // generate week calender dates for current week
  getDatesForCurrentWeek(): Array<Date> {
    return this.calenderService.generateDatesForCurrentWeek();
  }
}
