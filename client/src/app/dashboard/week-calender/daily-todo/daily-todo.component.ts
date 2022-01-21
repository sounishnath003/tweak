import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ScheduleEditObject,
  ScheduleObject,
  WeeklyScheduleService,
} from 'src/app/services/weekly-schedule.service';
import { DialoagboxComponent } from './dialoagbox/dialoagbox.component';

@Component({
  selector: 'app-daily-todo',
  template: `
    <div
      *ngFor="let work of works; let idx = index"
      [attr.data-index]="idx"
      class="flex-col w-full flex justify-start py-2 border-b hover:border-indigo-600"
      appDebounceDoubleClick
      (onDoubleClick)="onToggleModal($event, work)"
    >
      <form
        [formGroup]="editForms[idx]"
        (ngSubmit)="onEditSubmit(editForms[idx])"
      >
        <div *ngIf="convertEqualToDate(work)">
          <input
            formControlName="todo"
            class="outline-none border-none truncate w-full focus:bg-gray-50 focus:z-50"
            type="text"
            [value]="work.todo"
          />
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class DailyTodoComponent implements OnInit {
  @Input() date!: Date;
  works: Array<ScheduleEditObject> = [];
  editForms: Array<FormGroup> = [];

  constructor(
    readonly weeklyScheduleService: WeeklyScheduleService,
    public dialog: MatDialog
  ) {}

  onToggleModal(event: any, data: ScheduleEditObject) {
    const dialogRef: MatDialogRef<DialoagboxComponent, any> = this.dialog.open(
      DialoagboxComponent,
      {
        width: '600px',
        data: { payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((_data: boolean | ScheduleObject) => {
      if (typeof _data === 'object') {
        this.weeklyScheduleService.updateSchedule(_data);
        this.weeklyScheduleService.schedulesByDatesOrder$.subscribe((data) => {
          /** all good */
        });
      }
    });
  }

  ngOnInit(): void {
    this.weeklyScheduleService.schedulesByDatesOrder$.subscribe((data) => {
      for (const d in data) {
        if (d === this.date.toDateString())
          this.works = this.weeklyScheduleService.getWorksByDate(
            this.date
          ) as Array<ScheduleEditObject>;
      }
      this.works.forEach((work) => {
        this.editForms.push(this.createNewForm(work));
      });
    });
  }

  convertEqualToDate(work: ScheduleObject) {
    return new Date(work.date).toDateString() === this.date.toDateString();
  }

  onEditSubmit(editForm: FormGroup) {
    const payload: ScheduleEditObject = editForm.value;
    this.weeklyScheduleService.updateSchedule(payload);
    this.weeklyScheduleService.schedulesByDatesOrder$.subscribe((data) => {
      /** all good */
    });
  }

  private createNewForm(work: ScheduleEditObject): FormGroup {
    const editForm: FormGroup = new FormGroup({
      _id: new FormControl('', [Validators.requiredTrue]),
      __v: new FormControl('', [Validators.requiredTrue]),
      todo: new FormControl('', [Validators.requiredTrue]),
      date: new FormControl('', [Validators.requiredTrue]),
      colorCode: new FormControl('', [Validators.requiredTrue]),
      finished: new FormControl('', [Validators.requiredTrue]),
      username: new FormControl('', [Validators.requiredTrue]),
    });

    editForm.setValue({ ...work });
    return editForm;
  }
}
