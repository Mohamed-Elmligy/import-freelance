import { Routes } from '@angular/router';

const main_routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'data',
    loadComponent: () => import('./main-data/main-data.component'),
  },
];

export default main_routes;

export const main_routes_paths = {
  home: '/main/home',
  data: '/main/data',
} as const;
