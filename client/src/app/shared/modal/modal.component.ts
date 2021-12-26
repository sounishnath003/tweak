import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalServiceFactory } from './modal.service';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal">
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
    </div>
    <div class="modal-background"></div>
  `,
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  private element: any;

  constructor(
    private readonly modalService: ModalServiceFactory,
    private el: ElementRef
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error(`modal always needs to be intiated with a unique id`);
      return;
    }

    document.body.appendChild(this.element);
    this.element.addEventListener('click', (elem: any) => {
      if (elem.target.className === 'modal') this.close();
    });

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.element.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  close() {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
