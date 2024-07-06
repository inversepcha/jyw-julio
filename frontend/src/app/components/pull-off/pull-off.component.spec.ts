import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullOffComponent } from './pull-off.component';

describe('PullOffComponent', () => {
  let component: PullOffComponent;
  let fixture: ComponentFixture<PullOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
