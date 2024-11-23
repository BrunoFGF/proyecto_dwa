import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AutoresjsonService } from '../../services/autoresjson.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autor } from '../../models/Autor';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MyDialogComponent } from '../shared/my-dialog/my-dialog.component';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-crud-autores',
  standalone: true,
  imports: [MatFormField, MatLabel, MatPaginatorModule, MatButtonModule, MatInputModule,
    MatTableModule, MatSelectModule, MatCheckboxModule, MatOptionModule,
    MatFormFieldModule,CommonModule,NgIf, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './crud-autores.component.html',
  styleUrl: './crud-autores.component.css'
})
export class CrudAutoresComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  isEditMode:boolean=false;
  currentId!: number;
  ///dataSource (fuente de datos) para mi tabla
  dataSource = new MatTableDataSource<Autor>();
  @ViewChild(MatPaginator)paginator!:MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fechaMinima:Date = new Date(1940, 0, 1);
  fechaMaxima:Date = new Date();//Fecha actual
  ngOnInit(): void {
    this.getAutores();

  //inicializar las variables asociadas a los componentes del formulario
  this.form=this.fb.group({
    nombre:["", [Validators.required, Validators.pattern(/[A-Za-z0-9]+/g)]],
    nacionalidad:["",[Validators.required, Validators.pattern(/[A-Za-z0-9]+/g)]],
    fechanacimiento:["",[Validators.required]],
    imagen:[""],
    biografia:["",[Validators.required]],
    generosprincipales: ["",[Validators.required]],
    activo: [false]
  });
  }

  constructor(private autoresService:AutoresjsonService, private fb: FormBuilder,
    private mydialog:MatDialog
  ){}

  getAutores():void{
    this.autoresService.getAutores().subscribe((datos:Autor[])=> {
      this.dataSource.data = datos;
    });
  }

  search(searchInput: HTMLInputElement){
    if(searchInput.value){///representa lo que el usuario escribio en la caja de texto
    this.autoresService.getAutoresBusqueda(searchInput.value).subscribe((datos:Autor[])=> {
      this.dataSource.data = datos;
    });

    }else{
      this.getAutores();
    }
  }

  editar(autor: Autor): void {
    this.isEditMode = true;
  
    if (autor && autor.id) {
      this.currentId = autor.id;
    } else {
      console.log("Autor o el id del autor están undefined");
      return; // Salir si no hay datos válidos.
    }
    // Esperar a que las categorías estén cargadas y luego establecer los valores
    setTimeout(() => {
      this.form.setValue({
        nombre: autor.nombre,
        nacionalidad: autor.nacionalidad,
        fechanacimiento: autor.fechanacimiento,
        imagen: autor.imagen ? autor.imagen:'',
        biografia: autor.biografia,
        generosprincipales: autor.generosprincipales,
        activo: autor.activo
      });
    }, 0); // `setTimeout` asegura que las categorías estén listas antes de asignar el valor.
  }

  eliminar(autor:Autor):void{

    const dialogRef = this.mydialog.open(MyDialogComponent,{
      data:{
        titulo:"Eliminacion de Autor",
        contenido: "Estas seguro de eliminar el autor " + autor.nombre +" ?"
      }
    } );//para abrir la ventana de dialogo

    dialogRef.afterClosed().subscribe(result =>{
      if(result === "aceptar"){
        this.autoresService.deleteAutor(autor).subscribe(()=> {
          this.getAutores();//para que se actualize
        });
      }else if (result === "cancelar"){
      }
    });
  }

  clearForm():void{
    this.form.reset({
      nombre:'',
      nacionalidad:'',
      fechanacimiento:'',
      imagen:'',
      biografia:'',
      generosprincipales:'',
      activo: false
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

    const newAutor:Autor=this.form.value;
    if(this.isEditMode){//editar

      newAutor.id = this.currentId;
      this.autoresService.updateAutor(newAutor).subscribe((updateAutor)=>{
        alert("El autor fue editado exitosamente");
        this.getAutores();
        
      });

    }else{//agregar

      this.autoresService.addAutor(newAutor).subscribe((addAutor)=>{
        alert("El autor fue agregado exitosamente");
        this.getAutores();
      });
    }

    this.clearForm();

  }
}
