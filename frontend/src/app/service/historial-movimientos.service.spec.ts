import { TestBed } from '@angular/core/testing';

import { HistorialMovimientosService } from './historial-movimientos.service';

describe('HistorialMovimientosService', () => {
  let service: HistorialMovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialMovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
