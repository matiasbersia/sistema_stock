import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialPrecio } from '../interface/historiales';

@Injectable({
  providedIn: 'root'
})
export class HistorialPrecioService {

  private apiUrl = 'http://localhost:3000/historial_precios';

  constructor(private http: HttpClient) {}

  verHistorial(): Observable<HistorialPrecio[]> {
    return this.http.get<HistorialPrecio[]>(this.apiUrl);
  }

  verHistorialPorProducto(productoId: number): Observable<HistorialPrecio[]> {
    return this.http.get<HistorialPrecio[]>(`${this.apiUrl}/${productoId}`);
  }
}
