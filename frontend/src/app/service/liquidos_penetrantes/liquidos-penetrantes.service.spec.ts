import { TestBed } from '@angular/core/testing';

import { LiquidosPenetrantesService } from './liquidos-penetrantes.service';

describe('LiquidosPenetrantesService', () => {
  let service: LiquidosPenetrantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidosPenetrantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
