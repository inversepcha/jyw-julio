import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementosComponent } from './implementos.component';

describe('ImplementosComponent', () => {
  let component: ImplementosComponent;
  let fixture: ComponentFixture<ImplementosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImplementosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
