import { TestBed } from '@angular/core/testing';

import { HistorialSistemaService } from './historial-sistema.service';

describe('HistorialSistemaService', () => {
  let service: HistorialSistemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialSistemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
