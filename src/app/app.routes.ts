import { Routes } from '@angular/router';
import { ListaLibrosComponent } from './components/lista-libros/lista-libros.component';
import { CrudLibrosComponent } from './components/crud-libros/crud-libros.component';
import { ListaAutoresComponent } from './components/lista-autores/lista-autores.component';
import { CrudAutoresComponent } from './components/crud-autores/crud-autores.component';
import { ListaReseniaComponent } from './components/lista-resenia/lista-resenia.component';
import { CrudReseniaComponent } from './components/crud-resenia/crud-resenia.component';

export const routes: Routes = [
    {path: "lista-libros", component: ListaLibrosComponent},
    {path: "crud-libros", component: CrudLibrosComponent},
    {path: "lista-autores", component: ListaAutoresComponent},
    {path: "crud-autores", component: CrudAutoresComponent},
    {path: "lista-resenia",component: ListaReseniaComponent},
    {path: "crud-resenia",component: CrudReseniaComponent},
    {path: "", redirectTo:"lista-libros", pathMatch:'full'},
    {path: "**", redirectTo:"lista-libros"},///**  otra ruta mal */

];
