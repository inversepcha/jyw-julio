import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticulasMagneticasComponent } from './particulas-magneticas.component';

describe('ParticulasMagneticasComponent', () => {
  let component: ParticulasMagneticasComponent;
  let fixture: ComponentFixture<ParticulasMagneticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticulasMagneticasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticulasMagneticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
