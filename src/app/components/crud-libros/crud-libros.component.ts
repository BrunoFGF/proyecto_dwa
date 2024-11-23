import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LibrosjsonService } from '../../services/librosjson.service';
import { Libros } from '../../models/Libros';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AutoresjsonService } from '../../services/autoresjson.service';
import { Autor } from '../../models/Autor';

@Component({
  selector: 'app-crud-libros',
  standalone: true,
  imports: [MatFormField, MatLabel, MatPaginatorModule, MatButtonModule, MatInputModule,
    MatTableModule, MatSelectModule, MatCheckboxModule, MatOptionModule,
    MatFormFieldModule,CommonModule,NgIf,NgFor,FormsModule, ReactiveFormsModule
  ],
  templateUrl: './crud-libros.component.html',
  styleUrl: './crud-libros.component.css'
})
export class CrudLibrosComponent implements OnInit, AfterViewInit{

  form!: FormGroup;
  isEditMode:boolean=false;
  currentId!: number;
  selectedAutor: string | null = null;

  ///dataSource (fuente de datos) para mi tabla
  dataSource = new MatTableDataSource<Libros>();
  dataSourceAutor = new MatTableDataSource<Autor>();
  @ViewChild(MatPaginator)paginator!:MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getLibros();
    this.getAutores();

  //inicializar las variables asociadas a los componentes del formulario
  this.form=this.fb.group({
    titulo: ["", [Validators.required, Validators.pattern(/[A-Za-z0-9]+/g)]],
    autor: ["",[Validators.required]],
    area: ["",[Validators.required]],
    categoria: ["",[Validators.required]],
    estado: ["",[Validators.required]],
    descripcion: ["",[Validators.required]],
    idioma: ["",[Validators.required]],
    ubicacion: ["",[Validators.required]],
    imagen: [""],
    disponibilidad: [false]
  });
  }

  constructor(private librosService:LibrosjsonService, private AutoresService:AutoresjsonService, private fb: FormBuilder,
    private mydialog:MatDialog
  ){}

  getLibros():void{
    this.librosService.getLibros().subscribe((datos:Libros[])=> {
      this.dataSource.data = datos;
    });
  }

  getAutores():void{
    this.AutoresService.getAutores().subscribe((datos:Autor[])=> {
      this.dataSourceAutor.data = datos;
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

  editar(libros: Libros): void {
    this.isEditMode = true;
  
    if (libros && libros.id) {
      this.currentId = libros.id;
    } else {
      console.log("Libro o el id del libro están undefined");
      return; // Salir si no hay datos válidos.
    }
  
    // Actualizar las categorías según el área del libro
    this.onAreaChange(libros.area);
  
    // Esperar a que las categorías estén cargadas y luego establecer los valores
    setTimeout(() => {
      this.form.setValue({
        titulo: libros.titulo,
        autor: libros.autor,
        area: libros.area,
        categoria: libros.categoria, // Asegúrate de que este campo esté actualizado
        estado: libros.estado,
        descripcion: libros.descripcion,
        idioma: libros.idioma,
        ubicacion: libros.ubicacion,
        imagen: libros.imagen ? libros.imagen : '',
        disponibilidad: libros.disponibilidad
      });
    }, 0); // `setTimeout` asegura que las categorías estén listas antes de asignar el valor.
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

  clearForm():void{
    this.form.reset({
      titulo: '',
      autor: '',
      area: '',
      categoria: '',
      estado: '',
      descripcion: '',
      idioma: '',
      ubicacion: '',
      imagen: '',
      disponibilidad: false,
    });
    this.currentId=0;
    this.isEditMode = false;
  }

  onSubmit(){

    //revisar si el formulario es valido
    if(this.form.invalid){
      return;
    }

    //obtener los datos de los controles del formulario

    const newLibro:Libros=this.form.value;
    if(this.isEditMode){//editar

      newLibro.id = this.currentId;
      this.librosService.updateLibro(newLibro).subscribe((updateLibro)=>{
        alert("El libro fue editado exitosamente");
        this.getLibros();
        
      });

    }else{//agregar

      this.librosService.addLibro(newLibro).subscribe((addLibro)=>{
        alert("El libro fue agregado exitosamente");
        this.getLibros();
      });
    }

    this.clearForm();

  }

  //seleccionar Area y mostrar categoria segun el area.
  areas: string[] = [
    'Literatura',
    'CienciaFiccion',
    'Ciencia',
    'Historia',
    'Psicologia',
    'Filosofia',
    'Infantil_y_Juvenil',
    'Artes_y_Cultura',
    'Estrategia_y_Negocios',
    'Religion',
    'Educacion',
    'Tecnicos',
    'Gastronomia',
    'Viajes',
    'Deportes',
    'Sociedad',
    'Misterio_y_Suspenso']; // Áreas
  categorias: string[] = [];
  selectedArea: string = '';
  selectedCategoria: string = '';

  onAreaChange(area: string): void {
    // Cambiar categorías dinámicamente según el área seleccionada
    const categoriasPorArea: { [key: string]: string[] } = {
      Literatura: ['Novela', 'Poesía', 'Ensayo', 'Teatro', 'Clásico'],
      CienciaFiccion: ['Distopia', 'Space Opera', 'Fantasia Epica', 'Ucronia', 'Cyberpunk'],
      Ciencia: ['Divulgacion Cientifica', 'Fisica', 'Biologia', 'Matematicas', 'Astronomia'],
      Historia: ['Biografia', 'Ensayo Historico', 'Historia Universal', 'Historia De America', 'Cronicas'],
      Psicologia: ['Psicologia Positiva', 'Desarrollo Personal', 'Coaching', 'Relatos Terapeuticos', 'Espiritualidad'],
      Filosofia: ['Clasica', 'Moderna', 'Contemporanea', 'Etica', 'Politica'],
      Infantil_y_Juvenil: ['Cuentos Infantiles', 'Juvenil', 'Fantasia Juvenil', 'Aventuras', 'Educativos'],
      Artes_y_Cultura: ['Pintura', 'Escultura', 'Musica', 'Fotografia', 'Cine'],
      Estrategia_y_Negocios: ['Liderazgo', 'Economia', 'Marketing', 'Estrategia Empresarial', 'Innovacion'],
      Religion: ['Cristianismo', 'Budismo', 'Islam', 'Textos Sagrados', 'Espiritualidad Moderna'],
      Educacion: ['Metodos De Ensenanza', 'Didactica', 'Psicopedagogia', 'Educacion Infantil', 'Gestion Educativa'],
      Profesionales: ['Ingenieria', 'Medicina', 'Derecho', 'Arquitectura', 'Tecnologia'],
      Gastronomia: ['Recetarios', 'Cocina Internacional', 'Cocina Saludable', 'Reposteria', 'Vinos y Bebidas'],
      Viajes: ['GuiasDeViaje', 'RelatosDeViajeros', 'Aventura', 'Montanismo', 'Navegacion'],
      Deportes: ['Futbol', 'Aventura Deportiva', 'Historia Del Deporte', 'Tecnicas y Estrategias', 'Ciclismo'],
      Sociedad: ['Ensayo Politico', 'Sociologia', 'Antropologia', 'Relaciones Internacionales', 'Activismo'],
      Misterio_y_Suspenso: ['Thriller', 'Policiaco', 'Crimen', 'Suspenso Psicologico', 'Misterio Paranormal'],
    };
    this.categorias = categoriasPorArea[area] || [];
    this.selectedCategoria = '';
  }

}
