import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    title: 'Authentication',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component'),
    loadChildren: () => import('./modules/auth/auth.routes'),
    // canMatch: [authModuleGuard],
  },
  {
    path: 'main',
    title: 'Home page',
    loadComponent: () => import('./layouts/main-layout/main-layout.component'),
    loadChildren: () => import('./modules/main/main.routes'),
    // canMatch: [mainModuleGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./modules/shared/ui/unfound/unfound.component'),
  },
];
