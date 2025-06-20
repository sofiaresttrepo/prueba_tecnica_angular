import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'entidades',
    loadComponent: () => import('./entidades/entidades.component').then(m => m.default),
  },
  {
    path: 'contactos',
    loadComponent: () => import('./contactos/contactos.component').then(m => m.ContactosComponent),
  },
];