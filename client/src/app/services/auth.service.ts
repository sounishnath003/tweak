import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

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

  constructor(private readonly http: HttpClient) {
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
      .post(`/api/auth/login`, payload, { withCredentials: true })
      .pipe(
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
}
