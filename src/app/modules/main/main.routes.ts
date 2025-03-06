import { Routes } from '@angular/router';
import { noCompanyUserGuard } from '../../core/guards/no-company-user.guard';

const main_routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'data',
    loadComponent: () => import('./master-data/main-data/main-data.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'customers',
    loadComponent: () => import('./master-data/customers/customers.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./master-data/suppliers/suppliers.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'itemsCategory',
    loadComponent: () =>
      import('./master-data/items-category/items-category.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./master-data/payment-form/payment-form.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'expenses',
    loadComponent: () =>
      import('./master-data/expense-form/expense-form.component'),
    canActivate: [noCompanyUserGuard],
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
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoice/create-invoice/create-invoice.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'downloadReports',
    loadComponent: () =>
      import('./reports/download-reports/download-reports.component'),
    canActivate: [noCompanyUserGuard],
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
