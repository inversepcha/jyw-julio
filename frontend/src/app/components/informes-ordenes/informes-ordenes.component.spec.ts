import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesOrdenesComponent } from './informes-ordenes.component';

describe('InformesOrdenesComponent', () => {
  let component: InformesOrdenesComponent;
  let fixture: ComponentFixture<InformesOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformesOrdenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
