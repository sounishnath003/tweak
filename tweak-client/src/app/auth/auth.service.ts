import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new Subject();
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

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
        tap((data: any) => {
          this.user$.next({ username, accessToken: data.accessToken });
          this.isAuthenticated$.next(true);
        })
      );
  }
}
