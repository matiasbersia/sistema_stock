import { TestBed } from '@angular/core/testing';

import { OtroProductoService } from './otro-producto.service';

describe('OtroProductoService', () => {
  let service: OtroProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtroProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
