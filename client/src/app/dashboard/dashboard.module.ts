import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DebounceDoubleClickDirective } from '../directives/debounce-double-click.directive';
import { CalenderService } from '../services/calender.service';
import { WeeklyScheduleService } from '../services/weekly-schedule.service';
import { ModalModule } from '../shared/modal/modal.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { AddFormComponent } from './week-calender/add-form/add-form.component';
import { DailyTodoComponent } from './week-calender/daily-todo/daily-todo.component';
import { DialoagboxComponent } from './week-calender/daily-todo/dialoagbox/dialoagbox.component';
import { WeekCalenderComponent } from './week-calender/week-calender.component';
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core'

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    WeekCalenderComponent,
    AddFormComponent,
    DailyTodoComponent,
    DebounceDoubleClickDirective,
    DialoagboxComponent,
  ],
  providers: [CalenderService, WeeklyScheduleService],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    ModalModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class DashboardModule {}
