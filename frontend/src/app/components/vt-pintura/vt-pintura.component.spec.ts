import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtPinturaComponent } from './vt-pintura.component';

describe('VtPinturaComponent', () => {
  let component: VtPinturaComponent;
  let fixture: ComponentFixture<VtPinturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VtPinturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VtPinturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
