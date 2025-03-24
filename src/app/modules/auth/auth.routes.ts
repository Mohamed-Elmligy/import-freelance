import { Routes } from '@angular/router';

const auth_routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.default), // Login Component
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.default), // Register Component
  },
  {
    path: 'confirm-email',
    loadComponent: () =>
      import('./confirm-email/confirm-email.component').then((m) => m.default), // Confirm Email Component
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./verify-otp/verify-otp.component').then((m) => m.default), // Verify OTP Component
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./forget-password/forget-password.component').then(
        (m) => m.default
      ), // Forget Password Component
  },
];

export default auth_routes;

export const auth_routes_paths = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_USER: '/auth/verify-otp',
  FORGET_PASSWORD: '/auth/forget-password',
  CONFIRM_EMAIL: '/auth/confirm-email',
} as const;
