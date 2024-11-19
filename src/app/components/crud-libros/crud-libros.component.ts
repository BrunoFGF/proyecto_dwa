import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LibrosjsonService } from '../../services/librosjson.service';
import { Libros } from '../../models/Libros';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../shared/my-dialog/my-dialog.component';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-crud-libros',
  standalone: true,
  imports: [MatFormField, MatLabel, MatPaginatorModule, MatButtonModule, MatInputModule,
    MatTableModule, MatSelectModule, MatCheckboxModule, MatOptionModule,
    MatFormFieldModule,CommonModule,NgIf,NgFor, ReactiveFormsModule
  ],
  templateUrl: './crud-libros.component.html',
  styleUrl: './crud-libros.component.css'
})
export class CrudLibrosComponent implements OnInit, AfterViewInit{

  form!: FormGroup;
  isEditMode:boolean=false;
  currentId!: number;
  ///dataSource (fuente de datos) para mi tabla
  dataSource = new MatTableDataSource<Libros>();
  @ViewChild(MatPaginator)paginator!:MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getLibros();

  //inicializar las variables asociadas a los componentes del formulario
  this.form=this.fb.group({
    titulo: [""],
    autor: [""],
    area: [""],
    categoria: [""],
    estado: [""],
    descripcion: [""],
    idioma: [""],
    ubicacion: [""],
    imagen: [""],
    disponibilidad: [""],
    reseñas: [""]
  });
  }

  constructor(private librosService:LibrosjsonService, private fb: FormBuilder,
    private mydialog:MatDialog
  ){}

  getLibros():void{
    this.librosService.getLibros().subscribe((datos:Libros[])=> {
      this.dataSource.data = datos;
    });
  }

  search(searchInput: HTMLInputElement){
    if(searchInput.value){///representa lo que el usuario escribio en la caja de texto
    this.librosService.getLibrosBusqueda(searchInput.value).subscribe((datos:Libros[])=> {
      this.dataSource.data = datos;
    });

    }else{
      this.getLibros();
    }
  }

  editar(libros:Libros):void{

  }

  eliminar(libros:Libros):void{

    const dialogRef = this.mydialog.open(MyDialogComponent,{
      data:{
        titulo:"Eliminacion de Libro",
        contenido: "Estas seguro de eliminar el libro " + libros.titulo +" ?"
      }
    } );//para abrir la ventana de dialogo

    dialogRef.afterClosed().subscribe(result =>{
      if(result === "aceptar"){
        this.librosService.deleteLibro(libros).subscribe(()=> {
          this.getLibros();//para que se actualize
        });
      }else if (result === "cancelar"){
      }
    });
  }


  onSubmit(){}

  areas: string[] = ['Literatura', 'Ciencia', 'Arte']; // Áreas de ejemplo
  categorias: string[] = [];
  selectedArea: string = '';
  selectedCategoria: string = '';

  onAreaChange(area: string): void {
    // Cambiar categorías dinámicamente según el área seleccionada
    const categoriasPorArea: { [key: string]: string[] } = {
      Literatura: ['Novela', 'Poesía', 'Ensayo'],
      Ciencia: ['Física', 'Matemáticas', 'Biología'],
      Arte: ['Pintura', 'Música', 'Fotografía'],
    };
    this.categorias = categoriasPorArea[area] || [];
    this.selectedCategoria = '';
  }

}
