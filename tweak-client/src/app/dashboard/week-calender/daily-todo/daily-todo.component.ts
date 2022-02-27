import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-todo',
  template: `
    <div
      *ngFor="let work of works; let idx = index"
      [attr.data-index]="idx"
      class="flex-col w-full flex justify-start py-2 border-b hover:border-indigo-600"
      appDebounceDoubleClick
    >
      <form [formGroup]="editForms[idx]">
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
  works: Array<any> = [];
  worksSubscription: Subscription = new Subscription();
  editForms: Array<FormGroup> = [];

  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
