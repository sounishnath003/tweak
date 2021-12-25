import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalServiceFactory {
  private modals: Array<any> = [];
  constructor() {}

  open(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal.open();
  }

  close(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal.close();
  }

  add(modal: any) {
    this.modals.push(modal);
  }
  remove(modalId: string) {
    this.modals = this.modals.filter((modal) => modal.id !== modalId);
  }
}
