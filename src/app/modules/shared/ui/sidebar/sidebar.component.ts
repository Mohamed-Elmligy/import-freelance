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
        label: 'home',
        icon: 'pi pi-home',
        styleClass: 'menu-header',
        items: [
          {
            label: 'dashboard',
            icon: 'pi pi-chart-line',
            routerLink: this.mainRoutes.home,
            styleClass: 'menu-item',
            command: () => this.handleNavigation(),
          },
        ],
      },
      {
        label: 'masterData',
        icon: 'pi pi-database',
        styleClass: 'menu-header',
        items: [
          {
            label: 'customers',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.customersList,
          },
          {
            label: 'suppliers',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.suppliersList,
          },
          {
            label: 'itemsCategory',
            icon: 'pi pi-th-large',
            routerLink: this.mainRoutes.itemsCategoryList,
          },
          {
            label: 'payments',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.paymentsList,
          },
          {
            label: 'expenses',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.expensesList,
          },
          {
            label: 'transactions',
            icon: 'pi pi-credit-card',
            routerLink: this.mainRoutes.transactionsList,
          },
          {
            label: 'shippingData',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.shippingDataList,
          },
          {
            label: 'year',
            icon: 'pi pi-calendar',
            routerLink: this.mainRoutes.yearList,
          },
        ].map((item) => ({
          ...item,
          styleClass: 'menu-item',
          command: () => this.handleNavigation(),
        })),
      },
      {
        label: 'invoices',
        icon: 'pi pi-file',
        styleClass: 'menu-header',
        items: [
          {
            label: 'allInvoices',
            icon: 'pi pi-list',
            routerLink: this.mainRoutes.invoicesList,
            styleClass: 'menu-item',
            command: () => this.handleNavigation(),
          },
        ],
      },
      {
        label: 'reports',
        icon: 'pi pi-chart-bar',
        styleClass: 'menu-header',
        items: [], // Add report items as needed
      },
      {
        label: 'profile',
        icon: 'pi pi-user',
        styleClass: 'menu-header',
        items: [
          {
            label: 'settings',
            icon: 'pi pi-cog',
            routerLink: this.mainRoutes.settings,
            styleClass: 'menu-item',
          },
          {
            label: 'logout',
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
