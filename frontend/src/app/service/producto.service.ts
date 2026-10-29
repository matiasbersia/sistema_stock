import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interface/producto';



@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  getProductoPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${codigo}`);
  }

  crearProducto(producto: Partial<Producto>): Observable<any> {
    return this.http.post(this.baseUrl, producto);
  }

  actualizarProducto(codigo: string, producto: Partial<Producto>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${codigo}`, producto);
  }

borrarProducto(codigo: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${codigo}`);
}

buscarProductos(filtros: { nombre?: string; marca?: string; idCategoria?: number }): Observable<Producto[]> {
    let params = new HttpParams();
    if (filtros.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros.marca) params = params.set('marca', filtros.marca);
    if (filtros.idCategoria != null) params = params.set('idCategoria', filtros.idCategoria.toString());

    return this.http.get<Producto[]>(`${this.baseUrl}/buscar`, { params });
  }
getProductosSinStock(): Observable<Producto[]> {
  return this.http.get<Producto[]>(`${this.baseUrl}/sin-stock`);
}

getCantidadProductosActivos(): Observable<{ cantidad: number }> {
  return this.http.get<{ cantidad: number }>('http://localhost:3000/productos_cantidad');
}
getValorTotalStock(): Observable<{ total: number }> {
  return this.http.get<{ total: number }>(`http://localhost:3000/productos_valor_total`);
}

}
