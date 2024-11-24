
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
export class ListaReseniaComponent implements OnInit {
  resenias: Resenia[] = [];
  title = 'Lista de Reseñas';

  constructor(private reseniajsonService: ReseniajsonService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarResenias();
  }

  cargarResenias(): void {
    this.reseniajsonService.getResenias().subscribe((data) => (this.resenias = data));
  }

  intercambiar(resenia: Resenia): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      data: {
        titulo: 'Intercambio de Reseña',
        contenido: `¿Deseas intercambiar la reseña "${resenia.titulo}"?`,
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

