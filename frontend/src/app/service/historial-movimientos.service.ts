import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialMovimiento } from '../interface/historiales';
@Injectable({
  providedIn: 'root'
})
export class HistorialMovimientoService {

  private apiUrl = 'http://localhost:3000/historial_movimientos_stock'; 

  constructor(private http: HttpClient) {}

  verHistorial(): Observable<HistorialMovimiento[]> {
    return this.http.get<HistorialMovimiento[]>(this.apiUrl);
    
  }

verCantidadMes(): Observable<{ cantidad: number }> {
  return this.http.get<{ cantidad: number }>(`${this.apiUrl}/cantidad`);
}


}
