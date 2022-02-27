import { TestBed } from '@angular/core/testing';

import { WeekSchedulerService } from './week-scheduler.service';

describe('WeekSchedulerService', () => {
  let service: WeekSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
