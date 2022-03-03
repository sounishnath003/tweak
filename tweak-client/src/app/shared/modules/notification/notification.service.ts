import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export enum NotificationType {
  ERROR = '[ERROR]',
  SUCESS = '[SUCESS]',
  RESET = '[RESET]',
}

export interface NotificationInterface {
  text: string;
  notificationType: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnInit {
  private notificationSubject: BehaviorSubject<NotificationInterface> =
    new BehaviorSubject<NotificationInterface>({
      text: '',
      notificationType: NotificationType.RESET,
    });

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  notificationFactory() {
    return this.notificationSubject.asObservable();
  }

  createNotification(text: string, notificationType: NotificationType) {
    this._snackBar.open(text, notificationType, { duration: 3000 });
    this.notificationSubject.next({ text, notificationType });
    this.clearNotification();
  }

  clearNotification() {
    return clearInterval(
      setTimeout(() => {
        this.notificationSubject.next({
          text: '',
          notificationType: NotificationType.RESET,
        });
      }, 3000)
    );
  }
}
