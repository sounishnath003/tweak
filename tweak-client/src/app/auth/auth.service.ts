import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';
import { handleError } from 'src/shared/utils/error-handle.utils';

export type AuthState = { accessToken: string; isAuthenticated: boolean };

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
          JSON.stringify({ accesToken: '', isAuthenticated: false })
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
          };
          localStorage.setItem('user', JSON.stringify(authState));
          this.userSubject.next(authState);
          return response;
        })
      );
  }
}
