import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autor } from '../models/Autor';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoresjsonService {
  private jsonUrl = 'http://localhost:3000/autor';
  constructor(private http: HttpClient) { }

  getAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.jsonUrl);
  }

  ///Buscar
  getAutoresBusqueda(nombre?: string): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.jsonUrl).pipe(
      map((autores)=>
        autores.filter((autores)=>
        (nombre? autores.nombre.toLowerCase().includes(nombre.toLowerCase()):true)
    )
    )
    );
  }

  //Agregar
  addAutor(autores: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.jsonUrl, autores);
  }

  ///Editar
  updateAutor(autores: Autor): Observable<Autor> {
    const urlDeLosLibros = `${this.jsonUrl}/${autores.id}`;
    return this.http.put<Autor>(urlDeLosLibros, autores);
  }

  //ELiminar
  deleteAutor(autores: Autor): Observable<void> {
    const urlDeLosLibros = `${this.jsonUrl}/${autores.id}`;
    return this.http.delete<void>(urlDeLosLibros);
  }
}
