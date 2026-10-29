import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtroProducto } from '../interface/otro_producto';


@Injectable({
  providedIn: 'root'
})
export class OtroProductoService {

  private apiUrl = 'http://localhost:3000/otro_producto'; 

  constructor(private http: HttpClient) {}

  crearOtroProducto(data: OtroProducto): Observable<OtroProducto> {
    return this.http.post<OtroProducto>(this.apiUrl, data);
  }

  verOtroProducto(): Observable<OtroProducto[]> {
    return this.http.get<OtroProducto[]>(this.apiUrl);
  }
}
