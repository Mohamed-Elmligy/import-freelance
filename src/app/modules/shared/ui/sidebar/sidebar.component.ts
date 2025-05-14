import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { SecurityService } from '../../../../core/services/security.service';
import { UserPermissionService } from '../../../../services/user-permission.service';
import { auth_routes_paths } from '../../../auth/auth.routes';
import { main_routes_paths } from '../../../main/main.routes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    PanelMenuModule,
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
  private userPermissionService = inject(UserPermissionService);
  private securityService = inject(SecurityService);
  menuItems: MenuItem[] = [];
  mainRoutes = main_routes_paths;
  authRoutes = auth_routes_paths;

  ngOnInit() {
    this.callUserPermission();
  }

  callUserPermission() {
    this.userPermissionService.getUserPermissions().subscribe({
      next: (response) => {
        this.userPermissionService.userPermissions.set(response);
        this.initializeMenu();
      },
    });
  }

  private initializeMenu(): void {
    this.menuItems = [
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
        visible:
          !!this.userPermissionService.userPermissions()?.permissions
            ?.customers ||
          !!this.userPermissionService.userPermissions()?.permissions
            ?.suppliers ||
          !!this.userPermissionService.userPermissions()?.permissions?.items ||
          !!this.userPermissionService.userPermissions()?.permissions
            ?.shipments ||
          !!this.userPermissionService.userPermissions()?.permissions
            ?.fiscal_year,
        items: [
          {
            label: 'CUSTOMERS',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.customersList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.customers?.includes('view_customers') ?? false,
          },
          {
            label: 'SUPPLIERS',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.suppliersList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.suppliers?.includes('view_suppliers') ?? false,
          },
          {
            label: 'ITEMS_CATEGORY',
            icon: 'pi pi-th-large',
            routerLink: this.mainRoutes.itemsCategoryList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.items?.includes('view_items') ?? false,
          },
          {
            label: 'SHIPPING_DATA',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.shippingDataList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.shipments?.includes('view_shipments') ??
              false,
          },
          {
            label: 'FISCAL_YEARS',
            icon: 'pi pi-calendar',
            routerLink: this.mainRoutes.yearList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.fiscal_year?.includes('view_fiscal_year') ??
              false,
          },
        ],
      },
      {
        label: 'TRANSACTIONS',
        icon: 'pi pi-credit-card',
        styleClass: 'menu-header',
        visible:
          !!this.userPermissionService.userPermissions()?.permissions
            ?.transactions ||
          !!this.userPermissionService.userPermissions()?.permissions
            ?.payments ||
          !!this.userPermissionService.userPermissions()?.permissions?.expenses,
        items: [
          {
            label: 'TRANSACTIONS',
            icon: 'pi pi-credit-card',
            routerLink: this.mainRoutes.transactionsList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.transactions?.includes('view_transactions') ??
              false,
          },
          {
            label: 'PAYMENTS',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.paymentsList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.payments?.includes('view_payments') ?? false,
          },
          {
            label: 'EXPENSES',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.expensesList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.expenses?.includes('view_expenses') ?? false,
          },
        ],
      },
      {
        label: 'INVOICES',
        icon: 'pi pi-file',
        styleClass: 'menu-header',
        visible:
          !!this.userPermissionService.userPermissions()?.permissions?.invoices,
        items: [
          {
            label: 'ALL_INVOICES',
            icon: 'pi pi-list',
            routerLink: this.mainRoutes.invoicesList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.invoices?.includes('view_invoices') ?? false,
          },
        ],
      },
      {
        label: 'REPORTS',
        icon: 'pi pi-chart-bar',
        styleClass: 'menu-header',
        visible:
          !!this.userPermissionService.userPermissions()?.permissions?.reports,
        items: [
          {
            label: 'CONTAINER_DETAILS',
            icon: 'pi pi-box',
            routerLink: this.mainRoutes.reports.containerDetails,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes('view_container_reports') ??
              false,
          },
          {
            label: 'CONTAINER_COST',
            icon: 'pi pi-box',
            routerLink: this.mainRoutes.reports.containerPrice,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes('view_container_reports') ??
              false,
          },
          {
            label: 'SUPPLIER_REPORT',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.reports.supplierReport,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes('view_supplier_reports') ??
              false,
          },
          {
            label: 'CUSTOMER_FINANCIAL_REPORT',
            icon: 'pi pi-user',
            routerLink: this.mainRoutes.reports.customerFinancialReport,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes(
                  'view_customer_financial_reports'
                ) ?? false,
          },
          {
            label: 'SUPPLIER_PAYABLES_REPORT',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.reports.supplierPayablesReport,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes(
                  'view_supplier_payables_reports'
                ) ?? false,
          },
          {
            label: 'TOTAL_PAYMENTS_REPORT',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.reports.totalPaymentsReport,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes('view_payment_reports') ??
              false,
          },
          {
            label: 'TOTAL_EXPENSES_REPORT',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.reports.totalExpensesReport,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.reports?.includes('view_expenses_reports') ??
              false,
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
            visible: true,
          },
          {
            label: 'userList',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.usersList,
            visible:
              this.userPermissionService
                .userPermissions()
                ?.permissions?.accounts?.includes('view_accounts') ?? false,
          },
          {
            label: 'LOGOUT',
            icon: 'pi pi-sign-out',
            styleClass: 'menu-item logout-item',
            command: () => this.handleLogout(),
          },
        ],
      },
    ];
  }

  private handleLogout(): void {
    this.securityService.logout();
  }
}
