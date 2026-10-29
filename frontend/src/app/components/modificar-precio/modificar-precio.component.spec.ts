import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPrecioComponent } from './modificar-precio.component';

describe('ModificarPrecioComponent', () => {
  let component: ModificarPrecioComponent;
  let fixture: ComponentFixture<ModificarPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarPrecioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
