import { Routes } from '@angular/router';
import { unauthenticationGuard } from './core/guards/unauthentication.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    title: 'Authentication',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.default
      ),
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.default),
  },
  {
    path: 'main',
    title: 'Home page',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.default
      ),
    loadChildren: () =>
      import('./modules/main/main.routes').then((m) => m.default),
    canActivate: [unauthenticationGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./modules/shared/ui/unfound/unfound.component').then(
        (m) => m.default
      ),
  },
];
