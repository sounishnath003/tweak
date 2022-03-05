import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';
import { ColorUtils } from 'src/app/shared/utils/colors.utils';
import { Schedule } from 'src/app/shared/utils/types.utils';
import { DragSropShareService } from '../drag-share.service';
import { DialoagboxComponent } from './dialoagbox/dialoagbox.component';

@Component({
  selector: 'app-daily-todo',
  template: `
    <div
      cdkDropList
      [cdkDropListData]="works"
      [cdkDropListConnectedTo]="generatedIds[connectedIndex]"
      *ngFor="let work of works; let idx = index"
      [attr.data-index]="idx"
      class="flex-col w-full flex justify-start py-2 border-b hover:border-indigo-600"
      [id]="getUniqueId(work)"
    >
      <div
        cdkDrag
        class="schedule-div"
        fxLayout="row"
        fxLayoutAlign="space-between center"
      >
        <div>
          <div
            class="outline-none cursor-pointer border-none rounded-xl truncate inline px-2 w-full focus:bg-gray-50 focus:z-50"
            (click)="launchDialog($event, editForms[idx])"
            [ngClass]="
              work.finished
                ? ' opacity-50 line-through bg-gray-300'
                : getColor(work.colorCode)
            "
          >
            {{ work.todo }}
          </div>
        </div>
        <div class="display-on-parent-hover hidden">
          <mat-checkbox
            (change)="onCheck($event.checked, editForms[idx])"
            [checked]="work.finished"
          ></mat-checkbox>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .schedule-div:hover .display-on-parent-hover {
        visibility: visible;
        display: block;
      }
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
  @Input() generatedIds!: Array<string>;
  @Input() connectedIndex!: number;

  works: Array<Schedule> = [];
  editForms: Array<FormGroup> = [];
  bgColor: string = 'bg-transparent';

  constructor(
    private readonly weeklyScheduleService: WeekSchedulerService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private dragDropService: DragSropShareService
  ) {}

  getUniqueId(work: Schedule) {
    return `ID@${work._id}@${work.date}`;
  }

  ngOnInit(): void {
    console.log(this.generatedIds[this.connectedIndex]);

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
        this.snackbar.open(`Schedule has been updated`, 'Done', {
          duration: 3000,
          panelClass: ['bg-indigo-700', 'text-white'],
        });
      });
  }

  launchDialog(_: MouseEvent, form: FormGroup) {
    const previousState = { ...form.value };
    const dialogRef = this.dialog.open(DialoagboxComponent, {
      width: '600px',
      data: { payload: form.value, reference: this.dialog },
    });

    dialogRef.afterClosed().subscribe((result) => {
      form.setValue({ ...result });
      if (JSON.stringify(previousState) === JSON.stringify({ ...form.value }))
        return;
      this.onEdited(form);
    });
  }

  getColor(colorCode: string) {
    return ColorUtils.COLORS[+colorCode];
  }

  onDropped(event: CdkDragDrop<Array<Schedule>>) {
    this.dragDropService.drop(event);
    // const previousContainerId = event.previousContainer.id;
    // const currentContainerId = event.container.id;

    // const oldDate = previousContainerId.split('@')[2];
    // const curDate = currentContainerId.split('@')[2];

    // console.log({ oldDate, curDate });
  }

  onCheck(state: boolean, form: FormGroup) {
    form.setValue({ ...form.value, finished: state });
    this.onEdited(form);
  }
}
