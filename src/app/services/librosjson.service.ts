import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Libros } from '../models/Libros';

@Injectable({
  providedIn: 'root',
})
export class LibrosjsonService {
  private jsonUrl = 'http://localhost:3000/libros';
  constructor(private http: HttpClient) {}
  //metodo

  getLibros(): Observable<Libros[]> {
    return this.http.get<Libros[]>(this.jsonUrl);
  }

  ///Buscar
  getLibrosBusqueda(area?: string, categoria?: string): Observable<Libros[]> {
    return this.http.get<Libros[]>(this.jsonUrl).pipe(
      map((libros)=>
        libros.filter((libros)=>
        (area? libros.area.toLowerCase().includes(area.toLowerCase()):true) &&
        (categoria? libros.categoria.toLowerCase().includes(categoria.toLowerCase()):true)
    )
    )
    );
  }

  ///Agregar
  addMovie(libros: Libros): Observable<Libros> {
    return this.http.post<Libros>(this.jsonUrl, libros);
  }

  ///Editar

  updateMovie(libros: Libros): Observable<Libros> {
    const urlDeLosLibros = `${this.jsonUrl}/${libros.id}`;
    return this.http.put<Libros>(urlDeLosLibros, libros);
  }

  //ELiminar

  deleteMovie(libros: Libros): Observable<void> {
    const urlDeLosLibros = `${this.jsonUrl}/${libros.id}`;
    return this.http.delete<void>(urlDeLosLibros);
  }
}
