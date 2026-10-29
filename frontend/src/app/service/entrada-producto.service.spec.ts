import { TestBed } from '@angular/core/testing';

import { EntradaProductoService } from './entrada-producto.service';

describe('EntradaProductoService', () => {
  let service: EntradaProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
