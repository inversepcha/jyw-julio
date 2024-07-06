import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdherenciaComponent } from './adherencia.component';

describe('AdherenciaComponent', () => {
  let component: AdherenciaComponent;
  let fixture: ComponentFixture<AdherenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdherenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdherenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
