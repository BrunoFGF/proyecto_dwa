
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReseniajsonService } from '../../services/reseniajson.service';
import { Resenia } from '../../models/Resenia';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-crud-resenia',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './crud-resenia.component.html',
  styleUrl: './crud-resenia.component.css'
})
export class CrudReseniaComponent {
  reseniaForm!: FormGroup;
  resenias: Resenia[] = [];
  isEditMode = false;
  currentId: number | null = null;

  constructor(private fb: FormBuilder, private reseniajsonService: ReseniajsonService) {}

  ngOnInit(): void {
    this.cargarResenias();
    this.inicializarFormulario();
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
    this.reseniajsonService.getResenias().subscribe((data) => (this.resenias = data));
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
