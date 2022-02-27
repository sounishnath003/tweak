import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  CalendarService,
  WeekGenerationType,
} from 'src/app/shared/services/calendar.service';

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
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUsername: string = 'sounish';
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

  private onPreviousClicked() {
    this.calendarService.generateWeekDates(WeekGenerationType.PAST_WEEK);
    // this.weekScheduleService.getSchedulesForDateRange(startDate, endDate);
  }

  private onNextClicked() {
    this.calendarService.generateWeekDates(WeekGenerationType.NEXT_WEEK);
    // this.weekScheduleService.getSchedulesForDateRange(startDate, endDate);
  }

  public onWeekToggleClicked({ type }: { type: 'prev' | 'next' }): void {
    return type === 'prev' ? this.onPreviousClicked() : this.onNextClicked();
  }

  /**
   *
   * @param calendarService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly calendarService: CalendarService
  ) {
    this.currentUsername = this.authService.userAuthState.username;
    this.monthWithYear$ = this.calendarService.monthWithYear$;
  }

  ngOnInit(): void {}
}
