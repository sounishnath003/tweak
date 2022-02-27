import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekCalenderComponent } from './week-calender.component';

describe('WeekCalenderComponent', () => {
  let component: WeekCalenderComponent;
  let fixture: ComponentFixture<WeekCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
