import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  apiService = inject(ApiService);
  userPermissions = signal<UserPermissions | null>(null);
  getUserPermissions() {
    return this.apiService.getDataFromServer('account/current/permissions');
  }
}

export type UserPermissions = {
  id: number;
  username: string;
  role: string;
  permissions: {
    accounts: string[];
    invoices: string[];
    transactions: string[];
    expenses: string[];
    customers: string[];
    suppliers: string[];
    shipments: string[];
    reports: string[];
  };
};

// {
//   "id": 1,
//   "username": "admin",
//   "role": "Admin",
//   "permissions": {
//     "accounts": [
//       "view_account",
//       "create_account",
//       "edit_account",
//       "delete_account"
//     ],
//     "invoices": [
//       "view_invoices",
//       "create_invoices",
//       "edit_invoices",
//       "delete_invoices"
//     ],
//     "transactions": [
//       "view_transactions",
//       "create_transactions",
//       "edit_transactions",
//       "delete_transactions"
//     ],
//     "expenses": [
//       "view_expenses",
//       "create_expenses",
//       "edit_expenses",
//       "delete_expenses"
//     ],
//     "customers": [
//       "view_customers",
//       "create_customers",
//       "edit_customers",
//       "delete_customers"
//     ],
//     "suppliers": [
//       "view_suppliers",
//       "create_suppliers",
//       "edit_suppliers",
//       "delete_suppliers"
//     ],
//     "shipments": [
//       "view_shipments",
//       "create_shipments",
//       "edit_shipments",
//       "delete_shipments"
//     ],
//     "reports": [
//       "view_reports",
//       "view_customer_reports",
//       "view_supplier_reports",
//       "view_container_reports",
//       "view_transaction_reports",
//       "view_payment_reports"
//     ]
//   }
// }
