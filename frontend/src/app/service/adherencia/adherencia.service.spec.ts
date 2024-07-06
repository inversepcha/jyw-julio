import { TestBed } from '@angular/core/testing';

import { AdherenciaService } from './adherencia.service';

describe('AdherenciaService', () => {
  let service: AdherenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdherenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
