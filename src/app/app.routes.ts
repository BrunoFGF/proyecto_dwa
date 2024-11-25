import { Routes } from '@angular/router';
import { ListaLibrosComponent } from './components/lista-libros/lista-libros.component';
import { CrudLibrosComponent } from './components/crud-libros/crud-libros.component';
import { ListaAutoresComponent } from './components/lista-autores/lista-autores.component';
import { CrudAutoresComponent } from './components/crud-autores/crud-autores.component';
import { ListaReseniaComponent } from './components/lista-resenia/lista-resenia.component';
import { CrudReseniaComponent } from './components/crud-resenia/crud-resenia.component';
import {CrudIntercambiosComponent} from './components/crud-intercambios/crud-intercambios.component';
import {CrudUsuariosComponent} from './components/crud-usuarios/crud-usuarios.component';

export const routes: Routes = [
    {path: "lista-libros", component: ListaLibrosComponent},
    {path: "crud-libros", component: CrudLibrosComponent},
    {path: "lista-autores", component: ListaAutoresComponent},
    {path: "crud-autores", component: CrudAutoresComponent},
    {path: "lista-resenia",component: ListaReseniaComponent},
    {path: "crud-resenia",component: CrudReseniaComponent},
    {path: "crud-intercambios", component: CrudIntercambiosComponent},
    {path: "crud-usuarios", component: CrudUsuariosComponent},
    {path: "", redirectTo:"lista-libros", pathMatch:'full'},
    {path: "**", redirectTo:"lista-libros"},///**  otra ruta mal */

];
