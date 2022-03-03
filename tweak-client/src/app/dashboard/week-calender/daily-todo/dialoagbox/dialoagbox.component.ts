import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ColorUtils } from 'src/app/shared/utils/colors.utils';
import { Schedule } from 'src/app/shared/utils/types.utils';

@Component({
  selector: 'app-dialoagbox',
  template: `
    <form [formGroup]="formGroup">
      <div>
        <mat-form-field>
          <mat-label> {{ scheduleData.date | date: 'dd/MM/YYYY' }} </mat-label>
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
          <mat-label> Assign Color </mat-label>
          <div class="flex flex-wrap justify-start items-center space-x-4 my-3">
            <div
              *ngFor="let color of colors; let idx = index"
              [class]="
                'w-6 focus:border cursor-pointer h-6 rounded-full' +
                generateColor(idx)
              "
              (click)="colorSelector$.next(idx)"
            ></div>
          </div>
        </div>
      </div>
      <div mat-dialog-actions class="flex justify-end">
        <button color="accent" mat-button mat-dialog-close="false">
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
  colorCode: number = 0;
  colorSelector$: Subject<number> = new Subject<number>();

  colors: Array<string> = [
    'bg-red-500',
    'bg-yellow-300',
    'bg-green-400',
    'bg-blue-400',
  ];

  formGroup: FormGroup = new FormGroup({
    _id: new FormControl('', [Validators.requiredTrue]),
    __v: new FormControl('', [Validators.requiredTrue]),
    todo: new FormControl('', [Validators.requiredTrue]),
    date: new FormControl('', [Validators.requiredTrue]),
    colorCode: new FormControl('', [Validators.requiredTrue]),
    finished: new FormControl('', [Validators.requiredTrue]),
    username: new FormControl('', [Validators.requiredTrue]),
    createdAt: new FormControl('', [Validators.requiredTrue]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: { payload: Schedule }
  ) {
    this.scheduleData = dialogData.payload;
    this.formGroup.setValue({ ...this.scheduleData });
  }

  ngOnInit(): void {
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
      colorCode: this.colorCode,
    });
  }

  generateColor(id: number) {
    return ` ${ColorUtils.COLORS[id]}`;
  }
}
