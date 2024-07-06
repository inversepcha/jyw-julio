import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesInformesComponent } from './opciones-informes.component';

describe('OpcionesInformesComponent', () => {
  let component: OpcionesInformesComponent;
  let fixture: ComponentFixture<OpcionesInformesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionesInformesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionesInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
