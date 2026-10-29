import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../interface/categoria';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private url = 'http://localhost:3000/categorias';

  constructor(private http: HttpClient) {}

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, categoria);
  }

  verCategoria(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  borrarCategoria(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }

  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/${id}`, categoria);
  }
}
