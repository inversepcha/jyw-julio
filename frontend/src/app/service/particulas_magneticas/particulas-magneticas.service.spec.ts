import { TestBed } from '@angular/core/testing';

import { ParticulasMagneticasService } from './particulas-magneticas.service';

describe('ParticulasMagneticasService', () => {
  let service: ParticulasMagneticasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticulasMagneticasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
