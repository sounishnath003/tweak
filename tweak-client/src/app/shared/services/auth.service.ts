import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';
import { handleError } from 'src/app/shared/utils/error-handle.utils';
import { environment } from 'src/environments/environment';

export type AuthState = {
  accessToken: string;
  isAuthenticated: boolean;
  username: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<AuthState>;
  public user$: Observable<AuthState>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<AuthState>(
      JSON.parse(
        localStorage.getItem('user') ||
          JSON.stringify({
            accesToken: '',
            isAuthenticated: false,
            username: '',
          })
      )
    );

    this.user$ = this.userSubject.asObservable();
  }

  public get userAuthState(): AuthState {
    return this.userSubject.value;
  }

  signinWithUsernamePassword(username: string, password: string) {
    return this.http
      .post(
        `/api/auth/sign-in`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        shareReplay(),
        catchError(handleError),
        tap((response: any) => {
          const authState: AuthState = {
            accessToken: response.accessToken,
            isAuthenticated: true,
            username,
          };
          localStorage.setItem('user', JSON.stringify(authState));
          this.userSubject.next(authState);
          return response;
        })
      );
  }

  signupWithUsernamePassword(username: string, password: string) {
    return this.http
      .post(
        `/api/auth/sign-up`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        shareReplay(),
        catchError(handleError),
        tap((response: any) => {
          const authState: AuthState = {
            accessToken: response.accessToken,
            isAuthenticated: true,
            username,
          };
          localStorage.setItem('user', JSON.stringify(authState));
          this.userSubject.next(authState);
          return response;
        })
      );
  }

  logout() {
    localStorage.clear();
    this.userSubject.next({
      isAuthenticated: false,
      username: '',
      accessToken: '',
    });
    window.location.replace('/');
  }
}
