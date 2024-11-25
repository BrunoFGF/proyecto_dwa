import { Component, Inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';


@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { mensaje: string }) {}
}
