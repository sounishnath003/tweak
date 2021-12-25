import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalServiceFactory } from './modal.service';

@NgModule({
  declarations: [ModalComponent],
  providers: [ModalServiceFactory],
  exports: [ModalComponent],
  imports: [CommonModule],
})
export class ModalModule {}
