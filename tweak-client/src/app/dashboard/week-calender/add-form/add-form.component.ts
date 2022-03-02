import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';
import { Schedule } from 'src/app/shared/utils/types.utils';

@Component({
  selector: 'app-add-form',
  template: `
    <form
      [formGroup]="addForm"
      (ngSubmit)="onSubmit()"
      *ngFor="let a of [0, 1, 2, 3, 4, 5, 6]; let index"
      [class]="getStyle2(index)"
    >
      <input
        formControlName="todo"
        name="todo"
        autocomplete="false"
        type="text"
        *ngIf="index === 0"
        [class]="getStyle1(index)"
        placeholder="Add your today's action!"
        autocomplete="false"
        aria-autocomplete="none"
      />
    </form>
  `,
  styles: [],
})
export class AddFormComponent implements OnInit {
  @Input() date!: Date;
  constructor(private readonly weeklyScheduleService: WeekSchedulerService) {}

  addForm: FormGroup = new FormGroup({
    todo: new FormControl(null),
  });

  onSubmit() {
    const formData: Schedule = {
      ...this.addForm.value,
      date: this.date,
      colorCode: '1',
      finished: false,
    };

    this.weeklyScheduleService
      .createSchedule(formData)
      .subscribe((response) => {
        console.log(`[INFO]: New schedule has been created!`);
        this.addForm.reset();
      });
  }

  ngOnInit(): void {}

  /**
   * getStyle
   */
  public getStyle1(index: number) {
    const styles =
      'outline-none border-none truncate focus:bg-gray-50 focus:z-50';

    return index === 0 ? styles + ' py-2' : styles;
  }

  public getStyle2(index: number) {
    const styles =
      'flex-col flex justify-start space-y-2 border-b hover:border-indigo-600';

    return index === 0 ? styles : styles + ' py-5';
  }
}
