import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ScheduleObject,
  WeeklyScheduleService,
} from 'src/app/services/weekly-schedule.service';

@Component({
  selector: 'app-dialoagbox',
  template: `
    <div>
      <h1 mat-dialog-title>{{ scheduleData.date }}</h1>
      <div mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label> Your Todo </mat-label>
          <input matInput [value]="scheduleData.todo" />
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="flex justify-end">
        <button color="accent" mat-button mat-dialog-close="false">
          Cancel
        </button>
        <button
          mat-button
          mat-dialog-close="true"
          cdkFocusInitial
          color="primary"
        >
          Save
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./dialoagbox.component.css'],
})
export class DialoagboxComponent implements OnInit {
  scheduleData: ScheduleObject;
  @Output() cancelEvent: EventEmitter<HTMLButtonElement>;
  @Output() saveEvent: EventEmitter<ScheduleObject>;

  constructor(
    private readonly weekScheduleService: WeeklyScheduleService,
    @Inject(MAT_DIALOG_DATA) dialogData: { payload: ScheduleObject }
  ) {
    this.cancelEvent = new EventEmitter<HTMLButtonElement>();
    this.saveEvent = new EventEmitter<ScheduleObject>();
    this.scheduleData = dialogData.payload;
  }

  ngOnInit(): void {}

  onCancel() {
    this.cancelEvent.emit();
  }

  onSave() {
    console.log('data saved...');
    this.saveEvent.emit(this.scheduleData);
  }

  onChange(e: any) {
    const updatedSchedule = {
      ...this.scheduleData,
      date: new Date(e.value).toDateString(),
    };
    this.weekScheduleService.updateSchedule(updatedSchedule);
  }
}
