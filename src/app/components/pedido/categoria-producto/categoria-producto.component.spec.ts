import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionProductoComponent } from './categoria-producto.component';

describe('SeleccionProductoComponent', () => {
  let component: SeleccionProductoComponent;
  let fixture: ComponentFixture<SeleccionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
