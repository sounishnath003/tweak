import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs/internal/Subscription';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';
import { DragSropShareService } from './drag-share.service';

@Component({
  selector: 'app-week-calender',
  template: `
    <div class="my-3 p-2">
      <div class="grid-5-col">
        <div
          *ngFor="let date of weekDays; let indx = index"
          [attr.data-index]="indx"
          cdkDropListGroup
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
          <app-daily-todo
            [date]="date"
            [generatedIds]="generatedIds"
            [connectedIndex]="indx"
          ></app-daily-todo>
          <app-add-form
            cdkDropList
            [cdkDropListData]="[date]"
            [cdkDropListConnectedTo]="generatedIds"
            (cdkDropListDropped)="onDropped($event)"
            [id]="getUniqueId(date)"
            [date]="date"
          ></app-add-form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./week-calender.component.css'],
})
export class WeekCalenderComponent implements OnInit {
  weekDays: Date[] = [];
  subscriptions: Array<Subscription> = [];
  date: Date = new Date();
  generatedIds: Array<string> = [];

  constructor(
    private readonly weekSchedulerService: WeekSchedulerService,
    private calendarService: CalendarService,
    private snackbar: MatSnackBar,
    private dragDropService: DragSropShareService
  ) {}

  ngOnInit(): void {
    this.registerSubscriptions(() =>
      this.calendarService.calenderWeek$.subscribe((dates) => {
        this.weekDays = [...dates];
        this.generatedIds = [];
        this.weekDays.forEach((week) => {
          this.generatedIds.push(this.getUniqueId(week));
        });
      })
    );
    this.weekSchedulerService.refreshState();
    this.snackbar.open('Appstate Refreshed', 'Done', {
      duration: 3000,
      panelClass: ['bg-indigo-700', 'text-white'],
    });
  }

  private registerSubscriptions(callback: Function) {
    return this.subscriptions.push(callback());
  }

  onDropped(event: CdkDragDrop<any>) {
    this.dragDropService.drop(event);
  }

  getUniqueId(date: Date) {
    return `ID@${date.toDateString()}`;
  }
}
