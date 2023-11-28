import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaReportesComponent } from './empresa-reportes.component';

describe('EmpresaReportesComponent', () => {
  let component: EmpresaReportesComponent;
  let fixture: ComponentFixture<EmpresaReportesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaReportesComponent]
    });
    fixture = TestBed.createComponent(EmpresaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
