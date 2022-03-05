import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragSropShareService implements OnInit {
  constructor() {}
  ngOnInit(): void {}

  public drop(event: CdkDragDrop<any>) {
    console.log(event.container.id, event.previousContainer.id);

    if (event.previousContainer === event.container) {
      //   moveItemInArray(
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex
      //   );
      console.log('same service');
    } else {
      console.log('transfer service');

      //   transferArrayItem(
      //     event.previousContainer.data,
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex
      //   );
    }
  }
}
