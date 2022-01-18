import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ScheduleObject,
  WeeklyScheduleService,
} from 'src/app/services/weekly-schedule.service';

@Component({
  selector: 'app-dialoagbox',
  template: `
    <div
      style="min-width: 400px; margin: auto;"
      class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg
              class="h-6 w-6 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <input
              type="date"
              class="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
              #event
              [value]="scheduleData.date | date: 'YYYY-MM-dd'"
              (change)="onChange(event)"
            />
            <div class="mt-2" style="min-width: 100%;">
              <textarea
                class="rounded-lg px-1 w-64 font-semibold text-gray-700 py-2 outline-none border-none truncatefocus:bg-gray-50 focus:z-50 bg-gray-50"
                type="text"
                [value]="scheduleData.todo"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          (click)="onSave()"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save
        </button>
        <button
          type="button"
          (click)="onCancel()"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./dialoagbox.component.css'],
})
export class DialoagboxComponent implements OnInit {
  @Input() scheduleData!: ScheduleObject;
  @Output() cancelEvent: EventEmitter<HTMLButtonElement>;
  @Output() saveEvent: EventEmitter<ScheduleObject>;

  constructor(private readonly weekScheduleService: WeeklyScheduleService) {
    this.cancelEvent = new EventEmitter<HTMLButtonElement>();
    this.saveEvent = new EventEmitter<ScheduleObject>();
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
