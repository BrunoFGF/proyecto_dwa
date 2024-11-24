import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resenia } from '../models/Resenia';


@Injectable({
  providedIn: 'root',
})
export class ReseniajsonService {
  private jsonUrl = 'http://localhost:3000/resenia';

  constructor(private http: HttpClient) {}

  // Obtener todas las reseñas
  getResenias(): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(this.jsonUrl);
  }

  // Agregar nueva reseña
  addResenia(resenia: Resenia): Observable<Resenia> {
    return this.http.post<Resenia>(this.jsonUrl, resenia);
  }

  // Editar una reseña
  updateResenia(resenia: Resenia): Observable<Resenia> {
    const url = `${this.jsonUrl}/${resenia.id}`;
    return this.http.put<Resenia>(url, resenia);
  }

  // Eliminar una reseña
  deleteResenia(id: number): Observable<void> {
    const url = `${this.jsonUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
