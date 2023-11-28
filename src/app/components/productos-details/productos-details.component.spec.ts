import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDetailsComponent } from './productos-details.component';

describe('ProductosDetailsComponent', () => {
  let component: ProductosDetailsComponent;
  let fixture: ComponentFixture<ProductosDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosDetailsComponent]
    });
    fixture = TestBed.createComponent(ProductosDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
