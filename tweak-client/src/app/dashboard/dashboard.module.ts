import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { OnDoubleClickDirective } from '../shared/directives/on-double-click.directive';
import { AuthService } from '../shared/services/auth.service';
import { CalendarService } from '../shared/services/calendar.service';
import { WeekSchedulerService } from '../shared/services/week-scheduler.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { AddFormComponent } from './week-calender/add-form/add-form.component';
import { DailyTodoComponent } from './week-calender/daily-todo/daily-todo.component';
import { DialoagboxComponent } from './week-calender/daily-todo/dialoagbox/dialoagbox.component';
import { WeekCalenderComponent } from './week-calender/week-calender.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    WeekCalenderComponent,
    AddFormComponent,
    DailyTodoComponent,
    OnDoubleClickDirective,
    DialoagboxComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [AuthService, CalendarService, WeekSchedulerService],
})
export class DashboardModule {}
