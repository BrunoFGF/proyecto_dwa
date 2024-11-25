export interface Intercambio {
  id?: number;
  fecha_solicitud: Date;
  fecha_intercambio?: Date;
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado';
  libro_ofrecido_id: number;
  libro_solicitado_id: number;
  usuario_solicitante_id: number;
  usuario_propietario_id: number;
  ubicacion_intercambio?: string;
  mensaje: string;
  calificacion_intercambio?: number;
  comentario_intercambio?: string;
}
