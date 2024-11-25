import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, map, Observable} from 'rxjs';
import { Intercambio } from '../models/Intercambio';
import {Usuario} from '../models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class IntercambioService {
  private intercambiosUrl = 'http://localhost:3000/intercambios';
  private usuariosUrl = 'http://localhost:3000/usuarios';

  constructor(public http: HttpClient) {}

  getIntercambios(): Observable<Intercambio[]> {
    return this.http.get<Intercambio[]>(this.intercambiosUrl);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.usuariosUrl);
  }

  getIntercambiosConUsuarios(): Observable<any[]> {
    return forkJoin({
      intercambios: this.http.get<Intercambio[]>(this.intercambiosUrl),
      usuarios: this.http.get<Usuario[]>(this.usuariosUrl)
    }).pipe(
      map(({ intercambios, usuarios }) =>
        intercambios.map(intercambio => ({
          ...intercambio,
          solicitante: usuarios.find(u => u.id === intercambio.usuario_solicitante_id) || { nombre: 'Desconocido' },
          propietario: usuarios.find(u => u.id === intercambio.usuario_propietario_id) || { nombre: 'Desconocido' }
        }))
      )
    );
  }

  getIntercambiosPorEstado(estado: string): Observable<Intercambio[]> {
    return this.http.get<Intercambio[]>(this.intercambiosUrl).pipe(
      map((intercambios) =>
        intercambios.filter((intercambio) =>
          intercambio.estado.toLowerCase().includes(estado.toLowerCase())
        )
      )
    );
  }

  addIntercambio(intercambio: Intercambio): Observable<Intercambio> {
    return this.http.post<Intercambio>(this.intercambiosUrl, intercambio);
  }

  updateIntercambio(intercambio: Intercambio): Observable<Intercambio> {
    const url = `${this.intercambiosUrl}/${intercambio.id}`;
    return this.http.put<Intercambio>(url, intercambio);
  }

  deleteIntercambio(intercambio: Intercambio): Observable<void> {
    const url = `${this.intercambiosUrl}/${intercambio.id}`;
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
