import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type CustomError = { cause: string };

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject: Subject<CustomError>;

  constructor() {
    this.errorSubject = new Subject<CustomError>();
  }

  get error$(): Observable<CustomError> {
    return this.errorSubject.asObservable();
  }

  async createAlert(errorText: string) {
    this.errorSubject.next({ cause: errorText });
    await this.clearError();
  }

  private async clearError() {
    await this.delay(() => this.errorSubject.next({ cause: '' }), 1600);
  }

  private delay(callback: any, seconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        callback();
      }, seconds);
    });
  }
}
