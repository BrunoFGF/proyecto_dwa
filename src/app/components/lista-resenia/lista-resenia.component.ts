import { Component, OnInit } from '@angular/core';
import { ReseniajsonService } from '../../services/reseniajson.service';
import { MatDialog } from '@angular/material/dialog';
import { Resenia } from '../../models/Resenia';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lista-resenia',
  standalone: true,
  imports: [NgFor, NgIf, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './lista-resenia.component.html',
  styleUrl: './lista-resenia.component.css'
})
export class ListaReseniaComponent implements OnInit {
  
  title = 'Lista de Reseñas';
  resenias: Resenia[] = [];

  constructor(private miServicio: ReseniajsonService, private mydialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarResenias();
  }

  cargarResenias(): void {
    this.miServicio.getResenias().subscribe((data:Resenia[]) => {
      this.resenias = data;
    }) 
  }

  
}