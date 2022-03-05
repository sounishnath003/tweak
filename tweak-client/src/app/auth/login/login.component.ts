import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="m-20" fxLayout="column" fxLayoutAlign="start center">
      <div fxLayout="column" fxLayoutAlign="start center" class="my-6">
        <h1 class="text-5xl font-bold my-2 text-black">Tweak Planner</h1>
        <div class="body-font text-gray-800">
          Plan you week what we were used to those days👨🏻‍💻.
        </div>
      </div>
      <form
        [formGroup]="form"
        fxLayout="column"
        fxLayoutGap="30px"
        class="w-600"
      >
        <mat-form-field appearance="fill">
          <mat-label> Username </mat-label>
          <mat-error
            *ngIf="
              usernameField?.hasError('username') &&
              !usernameField?.hasError('required')
            "
          >
            Username is required!
          </mat-error>
          <mat-error *ngIf="usernameField?.hasError('required')">
            Username is <strong>required</strong>
          </mat-error>
          <input
            placeholder="sounishnath003"
            formControlName="username"
            matInput
            type="text"
          />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label> Password </mat-label>
          <mat-error
            *ngIf="
              passwordField?.hasError('password') &&
              !passwordField?.hasError('required')
            "
          >
            Password is required!
          </mat-error>
          <mat-error *ngIf="passwordField?.hasError('required')">
            Password is <strong>required</strong>
          </mat-error>
          <input
            placeholder="*** **** ***"
            formControlName="password"
            matInput
            type="password"
          />
        </mat-form-field>

        <div class="m-5" *ngIf="errors">
          <ul>
            <li *ngFor="let error of errors">
              <mat-error> {{ error }} </mat-error>
            </li>
          </ul>
        </div>

        <button
          [disabled]="form.invalid"
          mat-flat-button
          [color]="isSignup ? 'accent' : 'primary'"
          (click)="isSignup ? onSignup() : onSignin()"
        >
          {{ isSignup ? 'Sign up' : 'Login' }} &rarr;
        </button>
      </form>

      <div
        fxLayout="row"
        fxLayoutAlign="space-around center"
        class="m-5"
        fxLayoutGap="20px"
      >
        <div (click)="isSignup = !isSignup">
          {{ isSignup ? 'Already have an account?' : 'Do not have account?' }}
          <span class="text-decor">
            {{ isSignup ? 'Login' : 'Sign up' }}
          </span>
        </div>
        <div>|</div>
        <div>
          Forgot password?
          <span style="color: red; cursor: pointer;">Reset password</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isSignup: boolean = false;
  form: FormGroup;
  usernameField: AbstractControl | null = null;
  passwordField: AbstractControl | null = null;

  errors: Array<string> | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly snackbar: MatSnackBar
  ) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.usernameField = this.form.get('username');
    this.passwordField = this.form.get('password');
  }

  ngOnInit(): void {
    const isAuthenticated: boolean =
      this.authService.userAuthState.isAuthenticated;
    if (isAuthenticated) {
      window.location.replace('/');
    }
  }

  onSignup() {
    const { username, password } = this.form.value;
    this.authService.signupWithUsernamePassword(username, password).subscribe({
      next: (response) => {
        this.form.reset();
        window.location.replace('/');
        this.snackbar.open('App state re-initialized', 'Done', {
          duration: 3000,
        });
      },
      error: (error) => {
        const e = error.message;
        if (typeof e === 'string') {
          this.errors = [e];
          this.snackbar.open(e, 'Cancel', {
            duration: 3000,
            panelClass: ['bg-red-600', 'text-white'],
          });
        } else {
          this.errors = [...(error.error.message || `something went wrong!`)];
        }
      },
    });
  }

  onSignin() {
    const { username, password } = this.form.value;
    this.authService.signinWithUsernamePassword(username, password).subscribe({
      next: (response) => {
        const { redirectTo } = this.route.snapshot.queryParams;
        this.form.reset();
        window.location.replace(redirectTo);
        this.snackbar.open('You are logged in', 'Done', {
          duration: 3000,
        });
      },
      error: (error) => {
        const e = error.message;
        if (typeof e === 'string') {
          this.errors = [e];
          this.snackbar.open(e, 'Cancel', {
            duration: 3000,
            panelClass: ['bg-red-600', 'text-white'],
          });
        } else {
          this.errors = [...(error.error.message || `something went wrong!`)];
        }
      },
    });
  }
}
