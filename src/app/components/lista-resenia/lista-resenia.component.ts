
import { Component, OnInit } from '@angular/core';
import { ReseniajsonService } from '../../services/reseniajson.service';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent, DialogData } from '../shared/my-dialog/my-dialog.component';
import { Resenia } from '../../models/Resenia';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-lista-resenia',
  standalone: true,
  imports: [NgFor,MatCardModule],
  templateUrl: './lista-resenia.component.html',
  styleUrl: './lista-resenia.component.css'
})
export class ListaReseniaComponent {
  
  title = 'Lista de Reseñas';
  resenias: Resenia[] = [];

  constructor(private miServicio: ReseniajsonService, private mydialog: MatDialog) {}

  ngOnInit(): void {this.cargarResenias();};

  cargarResenias(): void {
    this.miServicio.getResenias().subscribe((data:Resenia[]) =>{
      this.resenias=data;
      console.log(this.resenias[1]);
    }) 
  }

  intercambiar(resenias: Resenia): void {
    const dialogRef = this.mydialog.open(MyDialogComponent, {
      data: {
        titulo: 'Intercambio de Reseña',
        contenido: `¿Te gusto "${resenias.titulo}"?`,
      } as DialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'aceptar') {
        console.log('Intercambio aceptado');
      } else {
        console.log('Intercambio cancelado');
      }
    });
  }

}

