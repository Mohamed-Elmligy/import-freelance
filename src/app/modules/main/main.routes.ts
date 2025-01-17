import { Routes } from '@angular/router';

const main_routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    // loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'register',
    // loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'verify-otp',
    // loadComponent: () => import('./pages/verify-otp/verify-otp.component'),
  },
  {
    path: 'forget-password',
    // loadComponent: () =>
    // import('./pages/forget-password/forget-password.component'),
  },
];

export default main_routes;

export const main_routes_paths = {} as const;
