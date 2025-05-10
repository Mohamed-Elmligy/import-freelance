import { Routes } from '@angular/router';
import { noCompanyUserGuard } from '../../core/guards/no-company-user.guard';
import {
  customersEditPermissionsGuard,
  customersListPermissionsGuard,
} from '../../core/guards/customers-permissions.guard';
import {
  suppliersEditPermissionsGuard,
  suppliersListPermissionsGuard,
} from '../../core/guards/suppliers-permissions.guard';
import {
  expensesEditPermissionsGuard,
  expensesListPermissionsGuard,
} from '../../core/guards/expense-permissions.guard';
import {
  transactionsEditPermissionsGuard,
  transactionsListPermissionsGuard,
} from '../../core/guards/transactions-permissions.guard';
import {
  shipmentsEditPermissionsGuard,
  shipmentsListPermissionsGuard,
} from '../../core/guards/shipments-permissions.guard';
import {
  invoicesEditPermissionsGuard,
  invoicesListPermissionsGuard,
} from '../../core/guards/invoices-permissions.guard';
import {
  accountsEditPermissionsGuard,
  accountsListPermissionsGuard,
} from '../../core/guards/accounts-permissions.guard';

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
    canActivate: [noCompanyUserGuard, customersListPermissionsGuard],
  },
  {
    path: 'suppliers-list',
    loadComponent: () =>
      import('./master-data/suppliers/suppliers-list/suppliers-list.component'),
    canActivate: [noCompanyUserGuard, suppliersListPermissionsGuard],
  },
  {
    path: 'items-category-list',
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
    canActivate: [noCompanyUserGuard, expensesListPermissionsGuard],
  },
  {
    path: 'transactions-list',
    loadComponent: () =>
      import(
        './master-data/repayments-form/repayments-list/repayments-list.component'
      ),
    canActivate: [noCompanyUserGuard, transactionsListPermissionsGuard],
  },
  {
    path: 'shipping-data-list',
    loadComponent: () =>
      import(
        './master-data/shipping-data-form/shipping-data-list/shipping-data-list.component'
      ),
    canActivate: [noCompanyUserGuard, shipmentsListPermissionsGuard],
  },
  {
    path: 'year-list',
    loadComponent: () =>
      import(
        './master-data/fiscal-year/fiscal-year-list/fiscal-year-list.component'
      ),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'invoices-list',
    loadComponent: () =>
      import('./invoice/invoices-list/invoices-list.component'),
    canActivate: [noCompanyUserGuard, invoicesListPermissionsGuard],
  },
  {
    path: 'user-data',
    loadComponent: () => import('./profile/user/user-data/user-data.component'),
    canActivate: [noCompanyUserGuard, accountsListPermissionsGuard],
  },
  {
    path: 'user-form',
    loadComponent: () => import('./profile/user/user-form/user-form.component'),
    canActivate: [noCompanyUserGuard, accountsEditPermissionsGuard],
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./master-data/customers/customer-form/customers.component'),
    canActivate: [noCompanyUserGuard, customersEditPermissionsGuard],
  },
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./master-data/suppliers/suppliers-form/suppliers.component'),
    canActivate: [noCompanyUserGuard, suppliersEditPermissionsGuard],
  },
  {
    path: 'items-category',
    loadComponent: () =>
      import('./master-data/items-category/item-form/items-category.component'),
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
    canActivate: [noCompanyUserGuard, expensesEditPermissionsGuard],
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./master-data/repayments-form/repayments-form.component'),
    canActivate: [noCompanyUserGuard, transactionsEditPermissionsGuard],
  },
  {
    path: 'shipping-data',
    loadComponent: () =>
      import('./master-data/shipping-data-form/shipping-data-form.component'),
    canActivate: [noCompanyUserGuard, shipmentsEditPermissionsGuard],
  },
  {
    path: 'year',
    loadComponent: () =>
      import(
        './master-data/fiscal-year/fiscal-year-form/fiscal-year-form.component'
      ),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoice/create-invoice/create-invoice.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'download-reports',
    loadComponent: () =>
      import('./reports/download-reports/download-reports.component'),
    canActivate: [noCompanyUserGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./profile/settings/settings.component'),
  },
  {
    path: 'users-list',
    loadComponent: () =>
      import('./profile/user/users-list/users-list.component'),
    canActivate: [noCompanyUserGuard, accountsListPermissionsGuard],
  },
  {
    path: 'reports',
    children: [
      {
        path: 'container-details',
        loadComponent: () =>
          import('./reports/download-reports/download-reports.component'),
        data: { reportType: 'invoiceDetails' },
        canActivate: [noCompanyUserGuard],
      },
      {
        path: 'supplier-report',
        loadComponent: () =>
          import('./reports/download-reports/download-reports.component'),
        data: { reportType: 'supplierReport' },
        canActivate: [noCompanyUserGuard],
      },
      {
        path: 'customer-financial-report',
        loadComponent: () =>
          import('./reports/download-reports/download-reports.component'),
        data: { reportType: 'customerFinancialReport' },
        canActivate: [noCompanyUserGuard],
      },
      {
        path: 'supplier-payables-report',
        loadComponent: () =>
          import('./reports/download-reports/download-reports.component'),
        data: { reportType: 'supplierPayablesReport' },
        canActivate: [noCompanyUserGuard],
      },
      {
        path: 'total-payments-report',
        loadComponent: () =>
          import('./reports/download-reports/download-reports.component'),
        data: { reportType: 'totalPaymentsReport' },
        canActivate: [noCompanyUserGuard],
      },
      {
        path: 'total-expenses-report',
        loadComponent: () =>
          import('./reports/download-reports/download-reports.component'),
        data: { reportType: 'totalExpensesReport' },
        canActivate: [noCompanyUserGuard],
      },
    ],
  },
];

export default main_routes;

export const main_routes_paths = {
  home: '/main/home',
  payments: '/main/payments',
  customers: '/main/customers',
  suppliers: '/main/suppliers',
  itemsCategory: '/main/items-category',
  expenses: '/main/expenses',
  transactions: '/main/transactions',
  shippingData: '/main/shipping-data',
  year: '/main/year',
  invoices: '/main/invoices',
  settings: '/main/settings',
  userForm: '/main/user-form',
  userData: '/main/user-data',
  downloadReports: '/main/download-reports',
  paymentsList: '/main/payments-list',
  customersList: '/main/customers-list',
  suppliersList: '/main/suppliers-list',
  itemsCategoryList: '/main/items-category-list',
  expensesList: '/main/expenses-list',
  transactionsList: '/main/transactions-list',
  shippingDataList: '/main/shipping-data-list',
  invoicesList: '/main/invoices-list',
  yearList: '/main/year-list',
  usersList: '/main/users-list',
  reports: {
    containerDetails: '/main/reports/container-details',
    supplierReport: '/main/reports/supplier-report',
    customerFinancialReport: '/main/reports/customer-financial-report',
    supplierPayablesReport: '/main/reports/supplier-payables-report',
    totalPaymentsReport: '/main/reports/total-payments-report',
    totalExpensesReport: '/main/reports/total-expenses-report',
  },
} as const;
