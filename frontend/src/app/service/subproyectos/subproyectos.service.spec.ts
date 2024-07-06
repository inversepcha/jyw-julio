import { TestBed } from '@angular/core/testing';

import { SubproyectosService } from './subproyectos.service';

describe('SubproyectosService', () => {
  let service: SubproyectosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubproyectosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
