import { TestBed } from '@angular/core/testing';

import { UltrasonidoService } from './ultrasonido.service';

describe('UltrasonidoService', () => {
  let service: UltrasonidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltrasonidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
