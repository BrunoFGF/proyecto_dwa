export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  fecha_registro: Date;
  libros_prestados?: number[];
  libros_solicitados?: number[];
  valoracion_promedio?: number;
  avatar_url?: string;
  rol: 'usuario' | 'admin';
  estado: 'activo' | 'inactivo';
}
