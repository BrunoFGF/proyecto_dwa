import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';


import { Intercambio } from '../../models/Intercambio';
import { IntercambioService } from '../../services/intercambio.service';
import { LibrosjsonService } from '../../services/librosjson.service';
import { MyDialogComponent } from '../shared/my-dialog/my-dialog.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-crud-intercambios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './crud-intercambios.component.html',
  styleUrl: './crud-intercambios.component.css'
})
export class CrudIntercambiosComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  currentId!: number;

  dataSource = new MatTableDataSource<Intercambio>();
  librosDisponibles: any[] = [];
  usuariosDisponibles: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  estadosIntercambio = [
    'pendiente',
    'aceptado',
    'rechazado',
    'completado',
    'cancelado'
  ];

  constructor(
    private intercambioService: IntercambioService,
    private librosService: LibrosjsonService,
    private fb: FormBuilder,
    private mydialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getIntercambios();
    this.getLibrosDisponibles();

    this.form = this.fb.group({
      fecha_solicitud: [new Date(), [Validators.required]],
      fecha_intercambio: [null],
      estado: ['pendiente', [Validators.required]],
      libro_ofrecido_id: ['', [Validators.required]],
      libro_solicitado_id: ['', [Validators.required]],
      usuario_solicitante_id: ['', [Validators.required]],
      usuario_propietario_id: ['', [Validators.required]],
      ubicacion_intercambio: [''],
      mensaje: ['', [Validators.required]],
      calificacion_intercambio: [null],
      comentario_intercambio: ['']
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getIntercambios(): void {
    this.intercambioService.getIntercambios().subscribe((datos: Intercambio[]) => {
      this.dataSource.data = datos;
    });
  }

  getLibrosDisponibles(): void {
    this.librosService.getLibros().subscribe(libros => {
      this.librosDisponibles = libros.filter(libro => libro.disponibilidad);
    });
  }

  getLibroTitulo(libroId: number): string {
    const libro = this.librosDisponibles.find((l) => l.id === libroId);
    return libro ? libro.titulo : 'Desconocido';
  }

  getUsuarioNombre(usuarioId: number): string {
    const usuario = this.usuariosDisponibles.find((u) => u.id === usuarioId);
    return usuario ? usuario.nombre : 'Desconocido';
  }


  search(searchInput: HTMLInputElement) {
    if (searchInput.value) {
      this.intercambioService.getIntercambiosPorEstado(searchInput.value)
        .subscribe((datos: Intercambio[]) => {
          this.dataSource.data = datos;
        });
    } else {
      this.getIntercambios();
    }
  }

  editar(intercambio: Intercambio): void {
    this.isEditMode = true;

    if (intercambio && intercambio.id) {
      this.currentId = intercambio.id;
    } else {
      console.log("Intercambio o ID indefinido");
      return;
    }

    this.form.patchValue({
      fecha_solicitud: intercambio.fecha_solicitud,
      fecha_intercambio: intercambio.fecha_intercambio,
      estado: intercambio.estado,
      libro_ofrecido_id: intercambio.libro_ofrecido_id,
      libro_solicitado_id: intercambio.libro_solicitado_id,
      usuario_solicitante_id: intercambio.usuario_solicitante_id,
      usuario_propietario_id: intercambio.usuario_propietario_id,
      ubicacion_intercambio: intercambio.ubicacion_intercambio,
      mensaje: intercambio.mensaje,
      calificacion_intercambio: intercambio.calificacion_intercambio,
      comentario_intercambio: intercambio.comentario_intercambio
    });
  }

  eliminar(intercambio: Intercambio): void {
    const dialogRef = this.mydialog.open(MyDialogComponent, {
      data: {
        titulo: "Eliminación de Intercambio",
        contenido: "¿Estás seguro de eliminar este intercambio?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "aceptar") {
        this.intercambioService.deleteIntercambio(intercambio).subscribe(() => {
          this.getIntercambios();
        });
      }
    });
  }

  clearForm(): void {
    this.form.reset({
      fecha_solicitud: new Date(),
      estado: 'pendiente'
    });
    this.currentId = 0;
    this.isEditMode = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const newIntercambio: Intercambio = this.form.value;

    if (this.isEditMode) {
      newIntercambio.id = this.currentId;
      this.intercambioService.updateIntercambio(newIntercambio).subscribe(() => {
        alert("El intercambio fue editado exitosamente");
        this.getIntercambios();
      });
    } else {
      this.intercambioService.addIntercambio(newIntercambio).subscribe(() => {
        alert("El intercambio fue agregado exitosamente");
        this.getIntercambios();
      });
    }

    this.clearForm();
  }

  actualizarEstado(intercambio: Intercambio, nuevoEstado: string): void {
    intercambio.estado = nuevoEstado as 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado';
    this.intercambioService.updateIntercambio(intercambio).subscribe(() => {
      this.getIntercambios();
    });
  }
}
