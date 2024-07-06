import { TestBed } from '@angular/core/testing';

import { InformesRutasService } from './informes-rutas.service';

describe('InformesRutasService', () => {
  let service: InformesRutasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformesRutasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
