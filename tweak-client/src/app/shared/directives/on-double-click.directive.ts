import {
  Directive,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { buffer, debounceTime, filter, map, Subject } from 'rxjs';

@Directive({
  selector: '[appOnDoubleClick]',
})
export class OnDoubleClickDirective implements OnInit, OnDestroy {
  private clicks$ = new Subject<MouseEvent>();

  @Output()
  onDoubleClick = new EventEmitter<MouseEvent>();

  ngOnInit(): void {
    this.clicks$
      .pipe(
        buffer(this.clicks$.pipe(debounceTime(500))),
        filter((lit) => lit.length === 2),
        map((e) => e[1])
      )
      .subscribe(this.onDoubleClick);
  }

  @HostListener('click', ['$event'])
  onDoubleClicked(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks$.next(event);
  }

  ngOnDestroy(): void {
    this.clicks$.complete();
  }
}
