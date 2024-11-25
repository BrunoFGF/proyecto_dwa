import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, Observable, switchMap, tap, throwError} from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private jsonUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.jsonUrl);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    const url = `${this.jsonUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  getUsuariosPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.jsonUrl).pipe(
      map(usuarios => usuarios.filter(usuario =>
        usuario.rol.toLowerCase() === rol.toLowerCase()
      ))
    );
  }

  getUsuariosActivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.jsonUrl).pipe(
      map(usuarios => usuarios.filter(usuario =>
        usuario.estado === 'activo'
      ))
    );
  }

  addUsuario(usuario: Usuario): Observable<Usuario> {
    // Asegurarse de que la fecha de registro sea la actual
    usuario.fecha_registro = new Date();

    // Obtener el último usuario para calcular el próximo ID
    return this.getUsuarios().pipe(
      map(usuarios => {
        // Buscar el ID más alto existente y sumarle 1
        const maxId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id || 0)) : 0;
        usuario.id = maxId + 1;
        return usuario;
      }),
      // Enviar la solicitud para guardar el usuario
      switchMap(usuarioConId => {
        // Convertir el id a cadena antes de enviarlo al backend.
        const usuarioParaGuardar = { ...usuarioConId, id: String(usuarioConId.id) };
        return this.http.post<Usuario>(this.jsonUrl, usuarioParaGuardar);
      })
    );
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    const url = `${this.jsonUrl}/${usuario.id}`;
    return this.http.put<Usuario>(url, usuario);
  }

  deleteUsuario(usuario: Usuario): Observable<void> {
    if (!usuario.id) {
      console.error('Intento de eliminar usuario sin ID');
      return throwError(() => new Error('No se puede eliminar un usuario sin ID'));
    }

    const url = `${this.jsonUrl}/${usuario.id}`;
    console.log('Intentando eliminar usuario con URL:', url);

    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Usuario ${usuario.id} eliminado exitosamente`)),
      catchError(error => {
        console.error('Error detallado al eliminar:', error);
        return throwError(() => new Error('Error al eliminar usuario'));
      })
    );
  }

  // Método para cambiar el estado del usuario
  cambiarEstadoUsuario(usuario: Usuario, estado: 'activo' | 'inactivo'): Observable<Usuario> {
    usuario.estado = estado;
    return this.updateUsuario(usuario);
  }

  // Método para actualizar la valoración promedio
  actualizarValoracion(usuario: Usuario, nuevaValoracion: number): Observable<Usuario> {
    if (!usuario.valoracion_promedio) {
      usuario.valoracion_promedio = nuevaValoracion;
    } else {
      // Calculamos el nuevo promedio (esto es un ejemplo simple)
      usuario.valoracion_promedio = (usuario.valoracion_promedio + nuevaValoracion) / 2;
    }
    return this.updateUsuario(usuario);
  }

  // Método para buscar usuarios por nombre o email
  buscarUsuarios(termino: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.jsonUrl).pipe(
      map(usuarios => usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        usuario.email.toLowerCase().includes(termino.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }
}
