import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';
import { ColorUtils } from 'src/app/shared/utils/colors.utils';
import { Schedule } from 'src/app/shared/utils/types.utils';

@Component({
  selector: 'app-dialoagbox',
  template: `
    <div fxLayout="flex-start center" fxLayoutGap="20px" class="mb-2">
      <div
        [class]="
          'w-6 border border-gray-600 cursor-pointer h-6 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-black' +
          selectedColor()
        "
      ></div>
      <div class="text-2xl font-bold">
        {{ scheduleData.date | date: 'dd.MM.YY' }}
      </div>
    </div>
    <form [formGroup]="formGroup">
      <div class="flex flex-row flex-wrap justify-between items-start">
        <mat-form-field>
          <mat-label> Date: </mat-label>
          <input
            formControlName="date"
            [value]="scheduleData.date"
            matInput
            [matDatepickerFilter]="checkNotToProvidePreviousWeek"
            [matDatepicker]="datepicker"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="datepicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #datepicker></mat-datepicker>
        </mat-form-field>
        <div
          (click)="onDelete()"
          class="p-1 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          <img src="assets/trash.svg" class="w-5 h-5" />
        </div>
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

        <div>
          <mat-label> Assign Color: </mat-label>
          <div class="flex flex-wrap justify-start items-center space-x-4 my-3">
            <button
              *ngFor="let color of colors; let idx = index"
              [class]="
                'w-6 border border-gray-600 cursor-pointer h-6 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-black' +
                generateColor(idx)
              "
              (click)="colorSelector$.next(idx)"
            ></button>
          </div>
        </div>
      </div>
      <div mat-dialog-actions class="flex justify-end">
        <button color="accent" mat-button [mat-dialog-close]="onCancel()">
          Cancel
        </button>
        <button
          mat-button
          [mat-dialog-close]="onSave()"
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
  scheduleData: Schedule;
  colorCode: number = -1;
  colorSelector$: Subject<number> = new Subject<number>();

  colors: Array<string> = [];

  formGroup: FormGroup = new FormGroup({
    _id: new FormControl(''),
    __v: new FormControl(''),
    todo: new FormControl(''),
    date: new FormControl(''),
    colorCode: new FormControl(''),
    finished: new FormControl(''),
    username: new FormControl(''),
    createdAt: new FormControl(''),
  });

  constructor(
    private weeklyScheduleService: WeekSchedulerService,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: { payload: Schedule; reference: MatDialog },
    private snackbar: MatSnackBar
  ) {
    this.scheduleData = dialogData.payload;
    this.formGroup.setValue({ ...this.scheduleData });
  }

  ngOnInit(): void {
    this.colors = [...ColorUtils.COLORS];
    this.colorSelector$.subscribe((colorCode) => (this.colorCode = colorCode));
  }

  checkNotToProvidePreviousWeek(d: Date | null) {
    const thresoldDate: Date = new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay())
    );
    const date = d || new Date();
    return date >= thresoldDate;
  }

  onSave() {
    return (this.dialogData.payload = {
      ...this.formGroup.value,
      colorCode:
        this.colorCode === -1
          ? this.formGroup.get('colorCode')?.value
          : this.colorCode,
    });
  }

  onCancel() {
    return (this.dialogData.payload = { ...this.scheduleData });
  }

  onDelete() {
    this.weeklyScheduleService
      .deleteSchedule({ ...this.scheduleData })
      .subscribe((response) => {
        this.dialogData.reference.closeAll();
        const snackbarRef: MatSnackBarRef<TextOnlySnackBar> =
          this.snackbar.open('Schedule has been deleted.', 'Undo', {
            duration: 5000,
            panelClass: ['bg-red-600', 'text-white'],
          });

        snackbarRef.onAction().subscribe(() => {
          this.weeklyScheduleService
            .createSchedule({
              ...this.scheduleData,
              colorCode: String(this.scheduleData.colorCode),
            })
            .subscribe((response) => {
              this.snackbar.open('Schedule has been restored.', 'Done', {
                duration: 3000,
                panelClass: ['bg-green-600', 'text-white'],
              });
            });
        });
      });
  }

  generateColor(id: number) {
    return ` ${ColorUtils.COLORS[id]}`;
  }

  selectedColor() {
    return ` ${ColorUtils.COLORS[+this.scheduleData.colorCode]}`;
  }
}
