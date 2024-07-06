import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProyectosComponent } from './sub-proyectos.component';

describe('SubProyectosComponent', () => {
  let component: SubProyectosComponent;
  let fixture: ComponentFixture<SubProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubProyectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
