import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-login',
  template: `
    <div *ngIf="error$ | async; let x" class="text-center">
      <div class="text-red-600 text-sm py-2 bg-red-100">
        {{ x }}
      </div>
    </div>
    <form
      [formGroup]="loginForm"
      (submit)="onSubmit()"
      class="flex h-screen p-8 shadow-lg rounded-lg"
    >
      <div
        class="m-auto flex flex-col space-y-5 justify-center items-center p-2"
      >
        <div class="text-2xl font-semibold">Tweak Auth</div>
        <div>
          <input
            formControlName="username"
            type="text"
            placeholder="Enter Username"
            class="bg-blue-100 px-8 py-2 rounded"
          />
          <div
            class="text-sm text-red-600"
            *ngIf="loginForm.touched && loginForm.get('username')?.hasError"
          >
            username can't be blank!
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <input
            formControlName="password"
            [type]="showPassword ? 'text' : 'password'"
            placeholder="enter password"
            class="bg-blue-100 px-8 py-2 rounded"
          />
          <div
            class="text-sm text-red-600"
            *ngIf="loginForm.touched && loginForm.get('password')?.hasError"
          >
            password can't be blank!
          </div>
          <div>
            <input (click)="showPassword = !showPassword" type="checkbox" />
            Show Password
          </div>
        </div>
        <div>
          <button [class]="getStyle()" [disabled]="loginForm.invalid">
            {{ newAccount ? 'Create account' : 'Login' }}
          </button>
        </div>
        <div
          (click)="newAccount = !newAccount"
          class="text-sm border-b cursor-pointer"
        >
          {{ getButtonText() }}
        </div>
      </div>
    </form>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  error$: Subject<string | null> = new Subject<string | null>();
  fallbackUrl: string = '';
  showPassword: boolean = false;
  newAccount: boolean = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) {
    if (this.authService.getAuthState$) {
      this.router.navigate(['', 'dashboard']);
    }
  }

  ngOnInit(): void {
    this.fallbackUrl = this.route.snapshot.queryParams['fallbackUrl'] || '/';
  }

  getButtonText() {
    return this.newAccount ? 'Back to Login' : "Don't have account? Signup";
  }

  public getStyle() {
    return this.newAccount
      ? 'px-10 py-3 rounded bg-red-500 hover:bg-red-600 text-white'
      : 'px-10 py-3 rounded bg-blue-700 hover:bg-blue-900 text-white';
  }

  onSubmit() {
    const payload = this.loginForm.value;
    this.authService
      .login(payload)
      .pipe(first())
      .subscribe((data) => {
        // this.router.navigateByUrl(this.fallbackUrl);
        window.location.replace('/');
      }),
      ({ error }: HttpErrorResponse) => {
        this.error$.next(error.error.message);
        this.errorService.createAlert('Something went wrong!');
        setTimeout(() => {
          this.error$.next(null);
        }, 1000);
        console.log(error);
      };
    this.loginForm.reset();
  }
}
