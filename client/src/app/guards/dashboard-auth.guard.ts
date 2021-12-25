import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DesktopAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authService.getAuthState$.subscribe((data) => {
      let status = data.isAuthenticated;
      status = data.isAuthenticated;
      console.log({ data, status });
      if (!status) {
        window.location.replace('/#/auth');
      } else {
        window.location.replace('/');
      }
      console.log({ status });
      return status;
    });

    return false;
  }
}
