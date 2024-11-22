import { Component } from '@angular/core';
import { Autor } from '../../models/Autor';
import { AutoresjsonService } from '../../services/autoresjson.service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, MyDialogComponent } from '../shared/my-dialog/my-dialog.component';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [UpperCasePipe, MatCardModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './lista-autores.component.html',
  styleUrl: './lista-autores.component.css'
})
export class ListaAutoresComponent {
  title= "Lista de autores";
  autores: Autor[]=[];

  constructor(private miServicio:AutoresjsonService, private mydialog:MatDialog){}

  ngOnInit():void{this.cargarAutores();};

  cargarAutores():void{

    this.miServicio.getAutores().subscribe((data:Autor[])=>{
      this.autores = data;
      console.log(this.autores[1]);
    });
  }

  biografia(autores:Autor):void{
    const dialogRef = this.mydialog.open(MyDialogComponent,{

      data:{
        titulo:autores.nombre,
        contenido: autores.biografia
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

  activar(imgAutor:HTMLImageElement){

    imgAutor.classList.add("activa")
  }
  
  desactivar(imgAutor:HTMLImageElement){

    imgAutor.classList.remove("activa")
  }
}
