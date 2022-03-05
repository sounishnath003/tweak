import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeekSchedulerService } from 'src/app/shared/services/week-scheduler.service';

@Injectable({
  providedIn: 'root',
})
export class DragSropShareService implements OnInit {
  constructor(
    private weekScheduleService: WeekSchedulerService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}

  public drop(event: CdkDragDrop<any>) {
    console.log('Transfer Service Has Triggered...');
    /**
     * {
     * current: "ID@Tue Mar 01 2022",
       previous: "ID@6220d2c709fdbd55b9009c56@2022-03-01T14:36:37.322Z"
      }
     */

    const scheduleId: string = event.previousContainer.id.split('@')[1]; // new Date(event.container.id.split('@')[2]);
    const dateTobePushed: Date = new Date(event.container.id.split('@')[1]);

    this.weekScheduleService
      .updateScheduleDatebyId(scheduleId, dateTobePushed)
      .subscribe((response) => {
        this.snackBar.open(
          `Schedule has been updated to ${dateTobePushed.toDateString()}`,
          'Done',
          { duration: 3000, panelClass: ['bg-indigo-700', 'text-white'] }
        );
      });
  }
}
