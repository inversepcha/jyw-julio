import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoImplentosComponent } from './tipo-implentos.component';

describe('TipoImplentosComponent', () => {
  let component: TipoImplentosComponent;
  let fixture: ComponentFixture<TipoImplentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoImplentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoImplentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
