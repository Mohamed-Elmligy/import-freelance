import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable, from, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  apiService = inject(ApiService);
  userPermissions = signal<UserPermissions | null>(null);
  private loadingPromise: Promise<void> | null = null;

  async loadUserPermissions() {
    // If permissions are already loaded, no need to load again
    if (this.userPermissions()) {
      return Promise.resolve();
    }

    // If there's already a loading promise, return it to avoid duplicate calls
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Create new loading promise
    this.loadingPromise = new Promise<void>(async (resolve) => {
      try {
        const permissions = await this.getUserPermissions().toPromise();
        this.userPermissions.set(permissions);
      } catch (error) {
        console.error('Error loading user permissions:', error);
      } finally {
        this.loadingPromise = null;
        resolve();
      }
    });

    return this.loadingPromise;
  }

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
