import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Intercambio } from '../models/Intercambio';

@Injectable({
  providedIn: 'root',
})
export class IntercambioService {
  private jsonUrl = 'http://localhost:3000/intercambios';

  constructor(private http: HttpClient) {}

  getIntercambios(): Observable<Intercambio[]> {
    return this.http.get<Intercambio[]>(this.jsonUrl);
  }

  getIntercambiosPorUsuario(usuarioId: number): Observable<Intercambio[]> {
    return this.http.get<Intercambio[]>(this.jsonUrl).pipe(
      map((intercambios) =>
        intercambios.filter(
          (intercambio) =>
            intercambio.usuario_solicitante_id === usuarioId ||
            intercambio.usuario_propietario_id === usuarioId
        )
      )
    );
  }

  getIntercambiosPorEstado(estado: string): Observable<Intercambio[]> {
    return this.http.get<Intercambio[]>(this.jsonUrl).pipe(
      map((intercambios) =>
        intercambios.filter((intercambio) =>
          intercambio.estado.toLowerCase().includes(estado.toLowerCase())
        )
      )
    );
  }

  addIntercambio(intercambio: Intercambio): Observable<Intercambio> {
    return this.http.post<Intercambio>(this.jsonUrl, intercambio);
  }

  updateIntercambio(intercambio: Intercambio): Observable<Intercambio> {
    const url = `${this.jsonUrl}/${intercambio.id}`;
    return this.http.put<Intercambio>(url, intercambio);
  }

  deleteIntercambio(intercambio: Intercambio): Observable<void> {
    const url = `${this.jsonUrl}/${intercambio.id}`;
    return this.http.delete<void>(url);
  }

  // Método para aceptar un intercambio
  aceptarIntercambio(intercambio: Intercambio): Observable<Intercambio> {
    intercambio.estado = 'aceptado';
    return this.updateIntercambio(intercambio);
  }

  // Método para rechazar un intercambio
  rechazarIntercambio(intercambio: Intercambio): Observable<Intercambio> {
    intercambio.estado = 'rechazado';
    return this.updateIntercambio(intercambio);
  }

  // Método para completar un intercambio
  completarIntercambio(
    intercambio: Intercambio,
    calificacion: number,
    comentario: string
  ): Observable<Intercambio> {
    intercambio.estado = 'completado';
    intercambio.calificacion_intercambio = calificacion;
    intercambio.comentario_intercambio = comentario;
    intercambio.fecha_intercambio = new Date();
    return this.updateIntercambio(intercambio);
  }
}
