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
    path: 'customers-list',
    loadComponent: () =>
      import('./master-data/customers/customer-list/customer-list.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'suppliers-list',
    loadComponent: () =>
      import('./master-data/suppliers/suppliers-list/suppliers-list.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'itemsCategory-list',
    loadComponent: () =>
      import('./master-data/items-category/items-list/items-list.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'payments-list',
    loadComponent: () =>
      import(
        './master-data/payment-form/payments-list/payments-list.component'
      ),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'expenses-list',
    loadComponent: () =>
      import('./master-data/expense/expense-list/expense-list.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'transactions-list',
    loadComponent: () =>
      import(
        './master-data/repayments-form/repayments-list/repayments-list.component'
      ),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'shippingData-list',
    loadComponent: () =>
      import(
        './master-data/shipping-data-form/shipping-data-list/shipping-data-list.component'
      ),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'invoices-list',
    loadComponent: () =>
      import('./invoice/invoices-list/invoices-list.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./master-data/customers/customer-form/customers.component'),
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
      import('./master-data/expense/expense-form/expense-form.component'),
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
  paymentsList: '/main/payments-list',
  customersList: '/main/customers-list',
  suppliersList: '/main/suppliers-list',
  itemsCategoryList: '/main/itemsCategory-list',
  expensesList: '/main/expenses-list',
  transactionsList: '/main/transactions-list',
  shippingDataList: '/main/shippingData-list',
  invoicesList: '/main/invoices-list',
} as const;
