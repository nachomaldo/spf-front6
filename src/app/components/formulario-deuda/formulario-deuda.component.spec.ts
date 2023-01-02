import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDeudaComponent } from './formulario-deuda.component';

describe('FormularioDeudaComponent', () => {
  let component: FormularioDeudaComponent;
  let fixture: ComponentFixture<FormularioDeudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioDeudaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
