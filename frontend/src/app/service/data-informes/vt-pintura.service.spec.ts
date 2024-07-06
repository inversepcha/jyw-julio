import { TestBed } from '@angular/core/testing';

import { VtPinturaService } from './vt-pintura.service';

describe('VtPinturaService', () => {
  let service: VtPinturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VtPinturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
