import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'entidades',
    loadComponent: () => import('./entidades/entidades.component').then(m => m.EntidadesComponent),
  },
  {
    path: 'contactos',
    loadComponent: () => import('./contactos/contactos.component').then(m => m.ContactosComponent),
  },
];