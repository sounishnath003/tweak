import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { ErrorService } from './error.service';

export interface UserInterface {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState$: BehaviorSubject<{
    username: string | null;
    isAuthenticated: boolean | null;
  }>;

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {
    this.authState$ = new BehaviorSubject<{
      username: string | null;
      isAuthenticated: boolean | null;
    }>(JSON.parse(localStorage.getItem('authState') as any));
  }

  get getAuthState$(): {
    username: string | null;
    isAuthenticated: boolean | null;
  } {
    return this.authState$.value;
  }

  login(payload: Partial<UserInterface>) {
    return this.http
      .post(`/api/auth/sign-in`, payload, { withCredentials: true })
      .pipe(
        catchError((error) => {
          this.errorService.createAlert(
            error.error.error.message ||
              'Sorry! Cannot able to authenticatet you. Please try again after sometime!'
          );
          return of(error);
        }),
        map((response: any) => {
          localStorage.setItem(
            'authState',
            JSON.stringify({
              username: response.data.username,
              isAuthenticated: response.data.success,
            })
          );
          this.authState$.next({
            username: response.data.username,
            isAuthenticated: response.data.success,
          });
          return response.data;
        })
      );
  }

  logout() {
    return this.http.get(`/api/auth/logout`, { withCredentials: true }).pipe(
      catchError(() => {
        localStorage.clear();
        return of([]);
      }),
      tap(() => {
        localStorage.clear();
        this.authState$.next({ username: null, isAuthenticated: false });
      })
    );
  }
}
