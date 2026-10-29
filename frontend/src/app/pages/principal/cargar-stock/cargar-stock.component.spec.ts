import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarStockComponent } from './cargar-stock.component';

describe('CargarStockComponent', () => {
  let component: CargarStockComponent;
  let fixture: ComponentFixture<CargarStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
