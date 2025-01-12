import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReseniajsonService } from '../../services/reseniajson.service';
import { Resenia } from '../../models/Resenia';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificacionComponent } from '../shared/notificacion/notificacion.component';

@Component({
  selector: 'app-crud-resenia',
  standalone: true,
  imports: 
  [
    MatInputModule, 
    ReactiveFormsModule, 
    MatPaginator, 
    MatIcon, 
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './crud-resenia.component.html',
  styleUrl: './crud-resenia.component.css'
})
export class CrudReseniaComponent implements OnInit {
  reseniaForm!: FormGroup;
  dataSource = new MatTableDataSource<Resenia>();
  displayedColumns: string[] = ['titulo', 'autor', 'opinion', 'comentario', 'acciones'];
  isEditMode = false;
  currentId: number | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder, 
    private reseniajsonService: ReseniajsonService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void 
  {
    this.inicializarFormulario();
    this.cargarResenias();
  }

  inicializarFormulario(): void 
  {
    this.reseniaForm = this.fb.group
    ({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      imagen: ['', Validators.required, [Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?\.(jpg|jpeg|png|gif)$/)]],
      opinion: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      comentario: ['', Validators.required],
    });
  }

  cargarResenias(): void 
  {
    this.reseniajsonService.getResenias().subscribe((data) => 
    {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  guardarResenia(): void 
  {
    if (this.reseniaForm.invalid) return;    
    const nuevaResenia: Resenia = this.reseniaForm.value;    
    
    if (this.isEditMode && this.currentId) 
    {
      nuevaResenia.id = this.currentId;      
      this.reseniajsonService.updateResenia(nuevaResenia).subscribe(() => 
      {
        this.cargarResenias();
        this.mostrarNotificacion('Reseña actualizada exitosamente');
        this.cancelarEdicion();
      });
    } else 
    {
      // Remove the id property when adding a new review
      delete nuevaResenia.id;
      this.reseniajsonService.addResenia(nuevaResenia).subscribe(() => 
      {
        this.cargarResenias();
        this.mostrarNotificacion('Reseña creada exitosamente');
        this.reseniaForm.reset();
      });
    }
  }

  editarResenia(resenia: Resenia): void 
  {
    this.isEditMode = true;
    this.currentId = resenia.id!;
    this.reseniaForm.patchValue(resenia);
  }

  eliminarResenia(id: number): void 
  {    
    this.reseniajsonService.deleteResenia(id).subscribe(() => 
    {
      this.cargarResenias();
      this.mostrarNotificacion('Reseña eliminada exitosamente');
      this.cancelarEdicion();
    });
  }

  cancelarEdicion(): void 
  {
    this.isEditMode = false;
    this.currentId = null;
    this.reseniaForm.reset();
  }

  //notificaciones
  private mostrarNotificacion(mensaje: string): void 
  {
    this.snackBar.openFromComponent(NotificacionComponent, 
    {
      data: { mensaje: mensaje },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}