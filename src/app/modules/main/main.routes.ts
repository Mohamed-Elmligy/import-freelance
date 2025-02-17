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
    path: 'customers',
    loadComponent: () => import('./master-data/customers/customers.component'),
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./master-data/suppliers/suppliers.component'),
  },
  {
    path: 'itemsCategory',
    loadComponent: () =>
      import('./master-data/items-category/items-category.component'),
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./master-data/payment-form/payment-form.component'),
  },
  {
    path: 'expenses',
    loadComponent: () =>
      import('./master-data/expense-form/expense-form.component'),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./master-data/repayments-form/repayments-form.component'),
  },
  {
    path: 'shippingData',
    loadComponent: () =>
      import('./master-data/shipping-data-form/shipping-data-form.component'),
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoice/create-invoice/create-invoice.component'),
  },
  {
    path: 'downloadReports',
    loadComponent: () =>
      import('./reports/download-reports/download-reports.component'),
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
  payments: '/main/payments',
  customers: '/main/customers',
  suppliers: '/main/suppliers',
  itemsCategory: '/main/itemsCategory',
  expenses: '/main/expenses',
  transactions: '/main/transactions',
  shippingData: '/main/shippingData',
  invoices: '/main/invoices',
  settings: '/main/settings',
  downloadReports: '/main/downloadReports',
} as const;
