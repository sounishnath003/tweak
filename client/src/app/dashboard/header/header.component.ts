import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CalenderService } from 'src/app/services/calender.service';
import { WeeklyScheduleService } from 'src/app/services/weekly-schedule.service';

@Component({
  selector: 'app-header',
  template: `
    <div class="flex justify-between space-x-1">
      <div class="flex space-x-4 m-auto text-4xl font-bold">
        <button
          (click)="onWeekToggleClicked({ type: 'prev' })"
          class="m-auto border hover:bg-gray-100 border-black rounded p-2"
        >
          <img src="assets/left-arrow.svg" class="w-5 h-5" />
        </button>
        <button
          (click)="onWeekToggleClicked({ type: 'next' })"
          class="m-auto border hover:bg-gray-100 border-black rounded p-2"
        >
          <img src="assets/right-arrow.svg" class="w-5 h-5" />
        </button>
        <div class="m-auto">
          <span>{{ monthWithYear$ | async }}</span>
        </div>
      </div>
      <div class="m-auto flex-1"></div>
      <div class="m-auto">@{{ currentUsername }}</div>
    </div>
  `,
  styles: [],
})
export class HeaderComponent implements OnInit {
  currentUsername: string;
  monthWithYear$: Observable<string> = new Observable<string>();
  @Output() onWeekToggle: EventEmitter<{ dates: Array<Date> }> =
    new EventEmitter();

  /**
   *
   * @param param0 { type }: { type: 'prev' | 'next' }
   * @memberof HeaderComponent
   * @description
   *
   *
   */

  private onPreviousClicked(): Array<Date> {
    const dates: Array<Date> = this.calenderService.generatePastWeekDates();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    this.weekScheduleService.getSchedulesForDateRange(startDate, endDate);
    return dates;
  }

  private onNextClicked(): Array<Date> {
    const dates: Array<Date> = this.calenderService.generateNextWeekDates();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    this.weekScheduleService.getSchedulesForDateRange(startDate, endDate);
    return dates;
  }

  public onWeekToggleClicked({ type }: { type: 'prev' | 'next' }): void {
    const dates: Array<Date> =
      type === 'prev' ? this.onPreviousClicked() : this.onNextClicked();
    this.onWeekToggle.emit({ dates });
  }

  /**
   *
   * @param calenderService
   */
  constructor(
    private calenderService: CalenderService,
    private readonly authService: AuthService,
    private readonly weekScheduleService: WeeklyScheduleService
  ) {
    this.monthWithYear$ = this.calenderService.monthWithYear$.asObservable();
    this.currentUsername = this.authService.getAuthState$.username as string;
  }

  ngOnInit(): void {}
}
