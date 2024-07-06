import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidosPenetrantesComponent } from './liquidos-penetrantes.component';

describe('LiquidosPenetrantesComponent', () => {
  let component: LiquidosPenetrantesComponent;
  let fixture: ComponentFixture<LiquidosPenetrantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidosPenetrantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidosPenetrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
