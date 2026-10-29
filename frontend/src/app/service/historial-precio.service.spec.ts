import { TestBed } from '@angular/core/testing';

import { HistorialPrecioService } from './historial-precio.service';

describe('HistorialPrecioService', () => {
  let service: HistorialPrecioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialPrecioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
