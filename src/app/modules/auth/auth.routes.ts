import { Routes } from '@angular/router';

const auth_routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component'),
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./verify-otp/verify-otp.component'),
  },
  {
    path: 'forget-password',
    loadComponent: () => import('./forget-password/forget-password.component'),
  },
];

export default auth_routes;

export const auth_routes_paths = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_USER: '/auth/verify-otp',
  FORGET_PASSWORD: '/auth/forget-password',
} as const;
