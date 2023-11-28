import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioEntregaComponent } from './servicio-entrega.component';

describe('ServicioEntregaComponent', () => {
  let component: ServicioEntregaComponent;
  let fixture: ComponentFixture<ServicioEntregaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicioEntregaComponent]
    });
    fixture = TestBed.createComponent(ServicioEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
