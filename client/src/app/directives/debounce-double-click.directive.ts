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
  selector: '[appDebounceDoubleClick]',
})
export class DebounceDoubleClickDirective implements OnInit, OnDestroy {
  private clicks$ = new Subject<MouseEvent>();

  @Output()
  onDoubleClick = new EventEmitter<MouseEvent>();

  ngOnInit(): void {
    this.clicks$
      .pipe(
        buffer(this.clicks$.pipe(debounceTime(250))),
        filter((lit) => lit.length === 2),
        map((e) => e[1])
      )
      .subscribe(this.onDoubleClick);
  }

  @HostListener('click', ['$event'])
  onClicked(event: MouseEvent) {
    this.clicks$.next(event);
  }

  ngOnDestroy(): void {
    this.clicks$.complete();
  }
}
