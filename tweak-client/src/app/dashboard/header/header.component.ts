import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  CalendarService,
  WeekGenerationType,
} from 'src/app/shared/services/calendar.service';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';

@Component({
  selector: 'app-header',
  template: `
    <div class="flex justify-between space-x-1">
      <div
        fxLayout.gt-lg="space-around center"
        fxLayout="start center"
        fxLayoutGap="20px"
        class="m-auto md:text-4xl text-3xl font-bold"
      >
        <div fxLayout="start center" fxLayoutGap="20px">
          <button
            (click)="onWeekToggleClicked({ type: 'prev' })"
            class="m-auto border hover:bg-gray-200 font-semibold border-black rounded p-2"
          >
            <img src="assets/left-arrow.svg" class="w-5 h-5" />
          </button>
          <button
            (click)="onWeekToggleClicked({ type: 'next' })"
            class="m-auto border hover:bg-gray-200 font-semibold border-black rounded p-2"
          >
            <img src="assets/right-arrow.svg" class="w-5 h-5" />
          </button>
        </div>

        <div class="m-auto">
          <span>{{ monthWithYear$ | async }}</span>
        </div>
      </div>
      <div class="m-auto flex-1"></div>

      <div class="m-auto">
        <button [matMenuTriggerFor]="menu">@{{ currentUsername }} 👋 </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onLogout()">Log out</button>
        </mat-menu>
      </div>
    </div>
  `,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUsername: string = 'sounish';
  monthWithYear$: Observable<string> = new Observable<string>();

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
    this.weekSchedulerService.refreshState();
  }

  private onNextClicked() {
    this.calendarService.generateWeekDates(WeekGenerationType.NEXT_WEEK);
    this.weekSchedulerService.refreshState();
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
    private readonly calendarService: CalendarService,
    private readonly weekSchedulerService: WeekSchedulerService
  ) {
    this.currentUsername = this.authService.userAuthState.username;
    this.monthWithYear$ = this.calendarService.monthWithYear$;
  }

  ngOnInit(): void {}

  onLogout() {
    this.authService.logout();
  }
}
