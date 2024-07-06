import { TestBed } from '@angular/core/testing';

import { PullOffService } from './pull-off.service';

describe('PullOffService', () => {
  let service: PullOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PullOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
