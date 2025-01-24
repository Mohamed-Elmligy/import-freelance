import { Routes } from '@angular/router';

const main_routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'payments',
    loadComponent: () => import('./main-data/main-data.component'),
  },
  {
    path: 'expense',
    loadComponent: () => import('./main-data/main-data.component'),
  },
  {
    path: 'partial-repayments',
    loadComponent: () => import('./main-data/main-data.component'),
  },
  {
    path: 'shipping-data',
    loadComponent: () => import('./main-data/main-data.component'),
  },
];

export default main_routes;

export const main_routes_paths = {
  home: '/main/home',
  payments: '/main/payments',
  expense: '/main/expense',
  partialRepayments: '/main/partial-repayments',
  shippingData: '/main/shipping-data',
} as const;
