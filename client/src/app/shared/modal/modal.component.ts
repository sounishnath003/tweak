import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <p>
      modal works!
    </p>
  `,
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
