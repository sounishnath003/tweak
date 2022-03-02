import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { buffer, debounceTime, filter, map, Subject } from 'rxjs';

@Directive({
  selector: '[appOnDoubleClick]',
})
export class OnDoubleClickDirective implements OnInit, OnDestroy {
  clicks$: Subject<MouseEvent>;

  @Output()
  onDoubleClick = new EventEmitter<MouseEvent>();
  
  constructor() {
    this.clicks$ = new Subject<MouseEvent>();
  }

  ngOnInit(): void {
    this.clicks$
      .pipe(
        buffer(this.clicks$.pipe(debounceTime(250))),
        filter((lit) => lit.length === 2),
        map((e) => e[1])
      )
      .subscribe(this.onDoubleClicked);
  }

  @HostListener('click', ['$event'])
  onDoubleClicked(event: MouseEvent) {
    this.clicks$.next(event);
  }

  ngOnDestroy(): void {
    this.clicks$.complete();
  }
}
