import { Routes } from '@angular/router';
import { ListaLibrosComponent } from './components/lista-libros/lista-libros.component';

export const routes: Routes = [
    {path: "lista-libros", component: ListaLibrosComponent},
    {path: "", redirectTo:"lista-libros", pathMatch:'full'},
    {path: "**", redirectTo:"lista-libros"},///**  otra ruta mal */

];
