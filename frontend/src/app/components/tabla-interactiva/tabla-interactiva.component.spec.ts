import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaInteractivaComponent } from './tabla-interactiva.component';

describe('TablaInteractivaComponent', () => {
  let component: TablaInteractivaComponent;
  let fixture: ComponentFixture<TablaInteractivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaInteractivaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaInteractivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
