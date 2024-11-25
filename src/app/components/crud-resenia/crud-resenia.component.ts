import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReseniajsonService } from '../../services/reseniajson.service';
import { Resenia } from '../../models/Resenia';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-crud-resenia',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule,MatPaginator,MatIcon,MatTableModule],
  templateUrl: './crud-resenia.component.html',
  styleUrl: './crud-resenia.component.css'
})
export class CrudReseniaComponent {
  reseniaForm!: FormGroup;
  dataSource = new MatTableDataSource<Resenia>();
  displayedColumns: string[] = ['titulo', 'autor', 'opinion', 'comentario', 'acciones'];
  isEditMode = false;
  currentId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private reseniajsonService: ReseniajsonService) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarResenias();
  }

  inicializarFormulario(): void {
    this.reseniaForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      imagen: ['', Validators.required],
      opinion: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      comentario: ['', Validators.required],
    });
  }

  cargarResenias(): void {
    this.reseniajsonService.getResenias().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  guardarResenia(): void {
    if (this.reseniaForm.invalid) return;

    const nuevaResenia: Resenia = this.reseniaForm.value;

    if (this.isEditMode) {
      nuevaResenia.id = this.currentId!;
      this.reseniajsonService.updateResenia(nuevaResenia).subscribe(() => {
        this.cargarResenias();
        this.cancelarEdicion();
      });
    } else {
      nuevaResenia.id = Date.now(); // Simulamos un ID único
      this.reseniajsonService.addResenia(nuevaResenia).subscribe(() => {
        this.cargarResenias();
        this.reseniaForm.reset();
      });
    }
  }

  editarResenia(resenia: Resenia): void {
    this.isEditMode = true;
    this.currentId = resenia.id!;
    this.reseniaForm.patchValue(resenia);
  }

  eliminarResenia(id: number): void {
    this.reseniajsonService.deleteResenia(id).subscribe(() => this.cargarResenias());
  }

  cancelarEdicion(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.reseniaForm.reset();
  }
}
