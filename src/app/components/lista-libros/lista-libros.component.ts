import { Component } from '@angular/core';
import { Libros } from '../../models/Libros';
import { LibrosjsonService } from '../../services/librosjson.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, MyDialogComponent } from '../shared/my-dialog/my-dialog.component';
import { UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lista-libros',
  standalone: true,
  imports: [UpperCasePipe, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './lista-libros.component.html',
  styleUrl: './lista-libros.component.css'
})
export class ListaLibrosComponent {

  title= "Lista de libros";
  libros: Libros[]=[];

  constructor(private miServicio:LibrosjsonService, private mydialog:MatDialog){}

  ngOnInit():void{this.cargarLibros();};

  cargarLibros():void{

    this.miServicio.getLibros().subscribe((data:Libros[])=>{
      this.libros = data;
      console.log(this.libros[0]);
    });

  }

  intercambiar(libro:Libros):void{
    const dialogRef = this.mydialog.open(MyDialogComponent,{

      data:{
        titulo:libro.titulo,
        contenido: "El libro" + libro.titulo + " entro en proceso de intercambio"
      }as DialogData,
    } );//para abrir la ventana de dialogo
    dialogRef.afterClosed().subscribe(result =>{
      if(result === "aceptar"){
        console.log("Aceptar");
      }else if (result === "cancelar"){
        console.error("Cancelar"); 
      }
    });

  }

  activar(imgLibro:HTMLImageElement){

    imgLibro.classList.add("activa")
  }
  
  desactivar(imgLibro:HTMLImageElement){

    imgLibro.classList.remove("activa")
  }
  
}

