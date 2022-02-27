import { Component, Input, OnInit } from '@angular/core';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';

@Component({
  selector: 'app-week-calender',
  template: `
    <div class="my-3 p-2">
      <div class="grid-5-col">
        <div
          *ngFor="let date of weekDays"
          class="py-4 rounded-lg text-gray-800"
        >
          <div
            class="flex text-xl flex-wrap flex-row justify-between border-b-2 py-2 border-black"
          >
            <div class="m-auto text-gray-800 font-semibold">
              {{ date | date: 'dd.MM' }}
            </div>
            <div class="flex-1 m-auto"></div>
            <div class="m-auto text-gray-400">
              {{ date | date: 'EE' }}
            </div>
          </div>
          <app-daily-todo [date]="date"></app-daily-todo>
          <app-add-form [date]="date"></app-add-form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./week-calender.component.css'],
})
export class WeekCalenderComponent implements OnInit {
  @Input() weekDays!: Date[];

  constructor(private readonly weekSchedulerService: WeekSchedulerService) {}

  ngOnInit(): void {
    this.weekSchedulerService.refreshState();
  }
}
