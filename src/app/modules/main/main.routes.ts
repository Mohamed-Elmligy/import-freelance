import { Routes } from '@angular/router';

const main_routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'data',
    loadComponent: () => import('./master-data/main-data/main-data.component'),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./master-data/payment-form/payment-form.component'),
  },
  {
    path: 'expense',
    loadComponent: () =>
      import('./master-data/expense-form/expense-form.component'),
  },
  {
    path: 'partial',
    loadComponent: () =>
      import('./master-data/repayments-form/repayments-form.component'),
  },
  {
    path: 'shipping',
    loadComponent: () =>
      import('./master-data/shipping-data-form/shipping-data-form.component'),
  },
  {
    path: 'create-invoice',
    loadComponent: () =>
      import('./invoice/create-invoice/create-invoice.component'),
  },
  {
    path: 'settings',
    loadComponent: () => import('./profile/settings/settings.component'),
  },
];

export default main_routes;

export const main_routes_paths = {
  home: '/main/home',
  data: '/main/data',
  payment: '/main/payment',
  expense: '/main/expense',
  repayments: '/main/partial',
  shippingData: '/main/shipping',
  createInvoice: '/main/create-invoice',
  settings: '/main/settings',
} as const;
