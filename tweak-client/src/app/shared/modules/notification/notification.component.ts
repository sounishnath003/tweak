import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  template: `
    <p>
      notification works!
    </p>
  `,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
