import { TestBed } from '@angular/core/testing';

import { TipoImplementoService } from './tipo-implemento.service';

describe('TipoImplementoService', () => {
  let service: TipoImplementoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoImplementoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
