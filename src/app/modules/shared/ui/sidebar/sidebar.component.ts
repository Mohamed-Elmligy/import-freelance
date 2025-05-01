import { Component, inject } from '@angular/core';
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
  menuItems: MenuItem[] = [];
  mainRoutes = main_routes_paths;
  authRoutes = auth_routes_paths;

  constructor() {
    this.initializeMenu();
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
          },
          {
            label: 'SUPPLIERS',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.suppliersList,
          },
          {
            label: 'ITEMS_CATEGORY',
            icon: 'pi pi-th-large',
            routerLink: this.mainRoutes.itemsCategoryList,
          },
          {
            label: 'SHIPPING_DATA',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.shippingDataList,
          },
          {
            label: 'FISCAL_YEARS',
            icon: 'pi pi-calendar',
            routerLink: this.mainRoutes.yearList,
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
          },
          {
            label: 'PAYMENTS',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.paymentsList,
          },
          {
            label: 'EXPENSES',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.expensesList,
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
          },
        ],
      },
      {
        label: 'REPORTS',
        icon: 'pi pi-chart-bar',
        styleClass: 'menu-header',
        items: [
          {
            label: 'CONTAINER_DETAILS',
            icon: 'pi pi-box',
            routerLink: this.mainRoutes.reports.containerDetails,
          },
          {
            label: 'SUPPLIER_REPORT',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.reports.supplierReport,
          },
          {
            label: 'CUSTOMER_FINANCIAL_REPORT',
            icon: 'pi pi-user',
            routerLink: this.mainRoutes.reports.customerFinancialReport,
          },
          {
            label: 'SUPPLIER_FINANCIAL_REPORT',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.reports.supplierFinancialReport,
          },
          {
            label: 'TOTAL_PAYMENTS_REPORT',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.reports.totalPaymentsReport,
          },
          {
            label: 'TOTAL_EXPENSES_REPORT',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.reports.totalExpensesReport,
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
          },
          {
            label: 'userList',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.usersList,
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
