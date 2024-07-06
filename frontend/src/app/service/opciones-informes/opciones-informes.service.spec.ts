import { TestBed } from '@angular/core/testing';

import { OpcionesInformesService } from './opciones-informes.service';

describe('OpcionesInformesService', () => {
  let service: OpcionesInformesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcionesInformesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
