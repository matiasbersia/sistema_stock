
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradaProductoService {

  private api = 'http://localhost:3000/entrada_producto';

  constructor(private http: HttpClient) {}

  // Obtener entrada por ID
  verEntradaPorId(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }

  // Cantidad de unidades ingresadas durante el mes
  verIngresosMes(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.api}/ingresos_mes`
    );
  }

  // Valor monetario de los ingresos del mes
  verValorIngresosMes(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.api}/ingresos_mes_valor`
    );
  }
}
