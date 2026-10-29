import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductoVenta {
  codigo?: string;      
  id?: number;          
  cantidad: number;
  precio_unitario: number;
}

export interface Venta {
  fecha?: string;
  total: number;
  productos?: ProductoVenta[];
  otros_productos?: ProductoVenta[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl = 'http://localhost:3000/pedido';

  constructor(private http: HttpClient) {}

  // ================================
  // Crear venta
  // ================================
  crearVenta(venta: Venta): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, venta);
  }

  // ================================
  // Historial de ventas
  // ================================
  getHistorial(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/historial-venta`);
  }

  // ================================
  // Ver venta / pedido por ID
  // (con los datos del producto incluidos por el JOIN)
  // ================================
  verPedidoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  
  // Cantidad de ventas del mes
  verCantidadVentasMes(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.baseUrl}/ventas_mes`
    );
  }

  // Importe total de las ventas del mes
  verTotalVentasMes(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.baseUrl}/ventas_mes_valor`
    );
  }

}
