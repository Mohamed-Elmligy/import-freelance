import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { main_routes_paths } from '../../../main/main.routes';
import { auth_routes_paths } from '../../../auth/auth.routes';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SecurityService } from '../../../../core/services/security.service';
import {
  UserPermissions,
  UserPermissionService,
} from '../../../../services/user-permission.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    RouterLink,
    CommonModule,
    RouterModule,
    TranslateModule,
    NgOptimizedImage,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private securityService = inject(SecurityService);
  private userPermissionService = inject(UserPermissionService);
  menuItems: MenuItem[] = [];
  mainRoutes = main_routes_paths;
  authRoutes = auth_routes_paths;
  userPermissions = signal<UserPermissions | null>(null);

  ngOnInit() {
    this.initializeMenu();
    this.handleNavigation();
    this.callUserPermission();
  }

  callUserPermission() {
    this.userPermissionService.getUserPermissions().subscribe({
      next: (response) => {
        this.userPermissions.set(response);
        this.userPermissionService.userPermissions.set(response);
        console.log(
          this.userPermissions()?.permissions.customers.includes(
            'view_customers'
          )
        );
      },
      error: (error) => {
        console.error('Error fetching user permissions:', error);
      },
    });
  }

  private initializeMenu(): void {
    this.menuItems = [
      {
        separator: true,
        styleClass: 'menu-separator',
      },
      {
        label: 'HOME',
        icon: 'pi pi-home',
        styleClass: 'menu-header',
        items: [
          {
            label: 'DASHBOARD',
            icon: 'pi pi-chart-line',
            routerLink: this.mainRoutes.home,
            styleClass: 'menu-item',
          },
        ],
      },
      {
        label: 'MASTER_DATA',
        icon: 'pi pi-database',
        styleClass: 'menu-header',
        items: [
          {
            label: 'CUSTOMERS',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.customersList,
            visible:
              this.userPermissions()?.permissions.customers.includes(
                'view_customers'
              ),
          },
          {
            label: 'SUPPLIERS',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.suppliersList,
            visible:
              this.userPermissions()?.permissions.suppliers.includes(
                'view_suppliers'
              ),
          },
          {
            label: 'ITEMS_CATEGORY',
            icon: 'pi pi-th-large',
            routerLink: this.mainRoutes.itemsCategoryList,
            visible: false, //not implemented yet
          },
          {
            label: 'SHIPPING_DATA',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.shippingDataList,
            visible:
              this.userPermissions()?.permissions.shipments.includes(
                'view_shipping_data'
              ),
          },
          {
            label: 'FISCAL_YEARS',
            icon: 'pi pi-calendar',
            routerLink: this.mainRoutes.yearList,
            visible: false, //not implemented yet
          },
        ],
      },
      {
        label: 'TRANSACTIONS',
        icon: 'pi pi-credit-card',
        styleClass: 'menu-header',
        items: [
          {
            label: 'TRANSACTIONS',
            icon: 'pi pi-credit-card',
            routerLink: this.mainRoutes.transactionsList,
            visible:
              this.userPermissions()?.permissions.transactions.includes(
                'view_transactions'
              ),
          },
          {
            label: 'PAYMENTS',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.paymentsList,
            visible: false, //not implemented yet
          },
          {
            label: 'EXPENSES',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.expensesList,
            visible:
              this.userPermissions()?.permissions.expenses.includes(
                'view_expenses'
              ),
          },
        ],
      },
      {
        label: 'INVOICES',
        icon: 'pi pi-file',
        styleClass: 'menu-header',
        items: [
          {
            label: 'ALL_INVOICES',
            icon: 'pi pi-list',
            routerLink: this.mainRoutes.invoicesList,
            visible:
              this.userPermissions()?.permissions.invoices.includes(
                'view_invoices'
              ),
          },
        ],
      },
      {
        label: 'REPORTS',
        icon: 'pi pi-chart-bar',
        styleClass: 'menu-header',
        visible:
          this.userPermissions()?.permissions.reports.includes('view_reports'),
        items: [
          {
            label: 'CONTAINER_DETAILS',
            icon: 'pi pi-box',
            routerLink: this.mainRoutes.reports.containerDetails,
            visible: this.userPermissions()?.permissions.reports.includes(
              'view_customer_reports'
            ),
          },
          {
            label: 'SUPPLIER_REPORT',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.reports.supplierReport,
            visible: this.userPermissions()?.permissions.reports.includes(
              'view_supplier_reports'
            ),
          },
          {
            label: 'CUSTOMER_FINANCIAL_REPORT',
            icon: 'pi pi-user',
            routerLink: this.mainRoutes.reports.customerFinancialReport,
            visible: this.userPermissions()?.permissions.reports.includes(
              'view_customer_reports'
            ),
          },
          {
            label: 'SUPPLIER_FINANCIAL_REPORT',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.reports.supplierFinancialReport,
            visible: this.userPermissions()?.permissions.reports.includes(
              'view_supplier_reports'
            ),
          },
          {
            label: 'TOTAL_PAYMENTS_REPORT',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.reports.totalPaymentsReport,
            visible: this.userPermissions()?.permissions.reports.includes(
              'view_payment_reports'
            ),
          },
          {
            label: 'TOTAL_EXPENSES_REPORT',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.reports.totalExpensesReport,
            visible: this.userPermissions()?.permissions.reports.includes(
              'view_expenses_reports'
            ),
          },
        ],
      },
      {
        label: 'PROFILE',
        icon: 'pi pi-user',
        styleClass: 'menu-header',
        items: [
          {
            label: 'SETTINGS',
            icon: 'pi pi-cog',
            routerLink: this.mainRoutes.settings,
            visible: false,
          },
          {
            label: 'userList',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.usersList,
            visible:
              this.userPermissions()?.permissions.accounts.includes(
                'view_account'
              ),
          },
          {
            label: 'LOGOUT',
            icon: 'pi pi-sign-out',
            styleClass: 'menu-item logout-item',
            command: () => this.handleLogout(),
          },
        ],
      },
      {
        separator: true,
        styleClass: 'menu-separator',
      },
    ];
  }

  private handleNavigation(): void {
    // Add any navigation-related logic here if needed
  }

  private handleLogout(): void {
    this.securityService.logout();
  }
}
