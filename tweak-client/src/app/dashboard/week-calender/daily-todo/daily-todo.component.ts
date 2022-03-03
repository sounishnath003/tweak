import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';
import { ColorUtils } from 'src/app/shared/utils/colors.utils';
import { Schedule } from 'src/app/shared/utils/types.utils';
import { DialoagboxComponent } from './dialoagbox/dialoagbox.component';

@Component({
  selector: 'app-daily-todo',
  template: `
    <div
      *ngFor="let work of works; let idx = index"
      [attr.data-index]="idx"
      class="flex-col w-full flex justify-start py-2 border-b hover:border-indigo-600"
      (click)="launchDialog($event, editForms[idx])"
    >
      <form [formGroup]="editForms[idx]" (ngSubmit)="onEdited(editForms[idx])">
        <div
          class="outline-none border-none rounded-xl truncate inline px-2 w-full focus:bg-gray-50 focus:z-50"
          [ngClass]="getColor(work.colorCode)"
        >
          {{ work.todo }}
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .bg-green-420 {
        background-color: #22ffa1;
      }
      .bg-yellow-420 {
        background-color: #fdef5d;
      }

      .bg-blue-420 {
        background-color: #a3b1ff;
      }
    `,
  ],
})
export class DailyTodoComponent implements OnInit, OnDestroy {
  @Input() date!: Date;
  works: Array<Schedule> = [];
  editForms: Array<FormGroup> = [];
  bgColor: string = 'bg-transparent';

  constructor(
    private readonly weeklyScheduleService: WeekSchedulerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.weeklyScheduleService.weekSchedules$.subscribe((data) => {
      const d = data[this.date.toDateString()];
      this.works = d ? [...d] : [];

      this.works.forEach((work) =>
        this.editForms.push(this.createNewForm({ ...work }))
      );
    });
  }
  ngOnDestroy(): void {}

  private createNewForm(work: Schedule): FormGroup {
    const editForm: FormGroup = new FormGroup({
      _id: new FormControl('', [Validators.requiredTrue]),
      __v: new FormControl('', [Validators.requiredTrue]),
      todo: new FormControl('', [Validators.requiredTrue]),
      date: new FormControl('', [Validators.requiredTrue]),
      colorCode: new FormControl('', [Validators.requiredTrue]),
      finished: new FormControl('', [Validators.requiredTrue]),
      username: new FormControl('', [Validators.requiredTrue]),
      createdAt: new FormControl('', [Validators.requiredTrue]),
    });

    editForm.setValue({ ...work });
    return editForm;
  }

  onEdited(form: FormGroup) {
    this.weeklyScheduleService
      .updateSchedule({ ...form.value })
      .subscribe(() => {
        console.log(`[UPDATE]: Schedule has been updated `);
      });
  }

  launchDialog(_: MouseEvent, form: FormGroup) {
    const previousState = { ...form.value };
    const dialogRef = this.dialog.open(DialoagboxComponent, {
      width: '600px',
      data: { payload: form.value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      form.setValue({ ...result });
      console.log({ result });

      if (JSON.stringify(previousState) === JSON.stringify({ ...form.value }))
        return;
      this.onEdited(form);
    });
  }

  getColor(colorCode: string) {
    return ColorUtils.COLORS[+colorCode];
  }
}
