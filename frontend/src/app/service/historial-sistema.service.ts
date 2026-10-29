import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialSistema } from '../interface/historiales';


@Injectable({
  providedIn: 'root'
})
export class HistorialSistemaService {

  private apiUrl = 'http://localhost:3000/historial_sistema';

  constructor(private http: HttpClient) {}

  verHistorial(): Observable<HistorialSistema[]> {
    return this.http.get<HistorialSistema[]>(this.apiUrl);
  }
}
