import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';
import { Schedule } from 'src/app/shared/utils/types.utils';
import { DialoagboxComponent } from './dialoagbox/dialoagbox.component';

@Component({
  selector: 'app-daily-todo',
  template: `
    <div
      *ngFor="let work of works; let idx = index"
      [attr.data-index]="idx"
      class="flex-col w-full flex justify-start py-2 border-b hover:border-indigo-600"
      appOnDoubleClick
      (onDoubleClick)="launchDialog($event, editForms[idx])"
    >
      <form [formGroup]="editForms[idx]" (ngSubmit)="onEdited(editForms[idx])">
        <div>
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
export class DailyTodoComponent implements OnInit, OnDestroy {
  @Input() date!: Date;
  works: Array<Schedule> = [];
  editForms: Array<FormGroup> = [];

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
    const dialogRef = this.dialog.open(DialoagboxComponent, {
      width: '600px',
      data: { payload: form.value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      form.setValue({ ...result });
      console.log({ result });
      // this.onEdited(form);
    });
  }
}
