import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuarios.service';
import { MyDialogComponent } from '../shared/my-dialog/my-dialog.component';

@Component({
  selector: 'app-crud-usuarios',
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
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.css']
})
export class CrudUsuariosComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  currentId!: number;
  hidePassword: boolean = true;

  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  roles = ['usuario', 'admin'];
  estados = ['activo', 'inactivo'];

  constructor(
      private usuarioService: UsuarioService,
      private fb: FormBuilder,
      private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      direccion: [''],
      rol: ['usuario', [Validators.required]],
      estado: ['activo', [Validators.required]],
      avatar_url: ['']
    });
  }

  getUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
        (datos: Usuario[]) => {
          this.dataSource.data = datos;
        }
    );
  }

  search(searchInput: HTMLInputElement): void {
    if (searchInput.value) {
      this.usuarioService.buscarUsuarios(searchInput.value)
          .subscribe(
              (datos: Usuario[]) => {
                this.dataSource.data = datos;
              }
          );
    } else {
      this.getUsuarios();
    }
  }

  editar(usuario: Usuario): void {
    this.isEditMode = true;

    if (usuario && usuario.id) {
      this.currentId = usuario.id;
    } else {
      console.log("Usuario o ID indefinido");
      return;
    }

    this.form.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      rol: usuario.rol,
      estado: usuario.estado,
      avatar_url: usuario.avatar_url
    });
    // No incluimos el password en el patch para mantenerlo seguro
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
  }

  eliminar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      data: {
        titulo: "Eliminación de Usuario",
        contenido: `¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "aceptar") {
        this.usuarioService.deleteUsuario(usuario).subscribe(() => {
          this.getUsuarios();
        });
      }
    });
  }

  clearForm(): void {
    this.form.reset({
      rol: 'usuario',
      estado: 'activo'
    });
    this.currentId = 0;
    this.isEditMode = false;
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const usuario: Usuario = this.form.value;

    if (this.isEditMode) {
      usuario.id = this.currentId;
      this.usuarioService.updateUsuario(usuario).subscribe(() => {
        alert("Usuario actualizado exitosamente");
        this.getUsuarios();
      });
    } else {
      this.usuarioService.addUsuario(usuario).subscribe(() => {
        alert("Usuario creado exitosamente");
        this.getUsuarios();
      });
    }

    this.clearForm();
  }

  cambiarEstado(usuario: Usuario, nuevoEstado: 'activo' | 'inactivo'): void {
    this.usuarioService.cambiarEstadoUsuario(usuario, nuevoEstado).subscribe(() => {
      this.getUsuarios();
    });
  }
}
