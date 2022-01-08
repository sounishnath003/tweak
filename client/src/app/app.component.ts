import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ErrorService } from './services/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tweak';
  error: string = '';
  constructor(private errorService: ErrorService) {
    this.getErrorAlert();
  }

  getErrorAlert() {
    this.errorService.error$.pipe(map((err) => err.cause)).subscribe((err) => {
      this.error = err;
    });
  }
}
