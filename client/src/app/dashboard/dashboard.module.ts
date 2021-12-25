import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CalenderService } from '../services/calender.service';
import { WeeklyScheduleService } from '../services/weekly-schedule.service';
import { ModalModule } from '../shared/modal/modal.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { AddFormComponent } from './week-calender/add-form/add-form.component';
import { DailyTodoComponent } from './week-calender/daily-todo/daily-todo.component';
import { WeekCalenderComponent } from './week-calender/week-calender.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    WeekCalenderComponent,
    AddFormComponent,
    DailyTodoComponent,
  ],
  providers: [CalenderService, WeeklyScheduleService],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    ModalModule,
  ],
})
export class DashboardModule {}
