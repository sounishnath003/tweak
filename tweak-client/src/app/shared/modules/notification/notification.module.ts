import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule],
  providers: [NotificationService],
  exports: [],
})
export class NotificationModule {}
