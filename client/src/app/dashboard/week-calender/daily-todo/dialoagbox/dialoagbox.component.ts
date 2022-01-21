import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ScheduleObject,
  WeeklyScheduleService,
} from 'src/app/services/weekly-schedule.service';

@Component({
  selector: 'app-dialoagbox',
  template: `
    <form [formGroup]="formGroup">
      <div>
        <mat-form-field>
          <mat-label> Choose date </mat-label>
          <input
            formControlName="date"
            [value]="scheduleData.date | date: 'YYYY-MM-dd'"
            matInput
            [matDatepicker]="datepicker"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="datepicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #datepicker></mat-datepicker>
        </mat-form-field>
      </div>
      <div mat-dialog-content>
        <mat-form-field appearance="fill" class="min-w-full">
          <mat-label> Your Todo </mat-label>
          <textarea
            formControlName="todo"
            matInput
            [value]="scheduleData.todo"
          ></textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="flex justify-end">
        <button color="accent" mat-button mat-dialog-close="false">
          Cancel
        </button>
        <button
          mat-button
          [mat-dialog-close]="formGroup.value"
          cdkFocusInitial
          color="primary"
        >
          Save
        </button>
      </div>
    </form>
  `,
  styleUrls: ['./dialoagbox.component.css'],
})
export class DialoagboxComponent implements OnInit {
  scheduleData: ScheduleObject;
  @Output() cancelEvent: EventEmitter<HTMLButtonElement>;
  @Output() saveEvent: EventEmitter<ScheduleObject>;

  formGroup: FormGroup = new FormGroup({
    _id: new FormControl('', [Validators.requiredTrue]),
    __v: new FormControl('', [Validators.requiredTrue]),
    todo: new FormControl('', [Validators.requiredTrue]),
    date: new FormControl('', [Validators.requiredTrue]),
    colorCode: new FormControl('', [Validators.requiredTrue]),
    finished: new FormControl('', [Validators.requiredTrue]),
    username: new FormControl('', [Validators.requiredTrue]),
  });

  constructor(
    private readonly weekScheduleService: WeeklyScheduleService,
    @Inject(MAT_DIALOG_DATA) dialogData: { payload: ScheduleObject }
  ) {
    this.cancelEvent = new EventEmitter<HTMLButtonElement>();
    this.saveEvent = new EventEmitter<ScheduleObject>();
    this.scheduleData = dialogData.payload;
    this.formGroup.setValue({ ...this.scheduleData });
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
