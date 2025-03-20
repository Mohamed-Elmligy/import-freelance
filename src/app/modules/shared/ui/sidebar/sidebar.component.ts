// import { Component, inject, OnInit } from '@angular/core';
// import { MenuItem } from 'primeng/api';
// import { MenuModule } from 'primeng/menu';
// import { BadgeModule } from 'primeng/badge';
// import { RippleModule } from 'primeng/ripple';
// import { AvatarModule } from 'primeng/avatar';
// import { main_routes_paths } from '../../../main/main.routes';
// import { auth_routes_paths } from '../../../auth/auth.routes';
// import { RouterLink, RouterModule } from '@angular/router';
// import { CommonModule, NgOptimizedImage } from '@angular/common';
// import { TranslateModule } from '@ngx-translate/core';
// import { SecurityService } from '../../../../core/services/security.service';

// @Component({
//   selector: 'app-sidebar',
//   imports: [
//     MenuModule,
//     BadgeModule,
//     RippleModule,
//     AvatarModule,
//     RouterLink,
//     CommonModule,
//     RouterModule,
//     TranslateModule,
//     NgOptimizedImage,
//   ],
//   templateUrl: './sidebar.component.html',
// })
// export default class SidebarComponent {
//   items: MenuItem[] = [];
//   mainRoutes = main_routes_paths;
//   authRoutes = auth_routes_paths;
//   public securityService = inject(SecurityService);
//   ngOnInit(): void {
//     this.items = [
//       { separator: true },
//       {
//         label: 'home',
//         items: [
//           {
//             label: 'home',
//             icon: 'pi pi-home',
//             routerLink: this.mainRoutes.home,
//           },
//         ],
//       },
//       {
//         label: 'masterData',
//         items: [
//           {
//             label: 'customers',
//             icon: 'pi pi-users',
//             routerLink: this.mainRoutes.customersList,
//           },
//           {
//             label: 'suppliers',
//             icon: 'pi pi-truck',
//             routerLink: this.mainRoutes.suppliersList,
//           },
//           {
//             label: 'itemsCategory',
//             icon: 'pi pi-objects-column',
//             routerLink: this.mainRoutes.itemsCategoryList,
//           },
//           {
//             label: 'payments',
//             icon: 'pi pi-wallet',
//             routerLink: this.mainRoutes.paymentsList,
//           },
//           {
//             label: 'expenses',
//             icon: 'pi pi-dollar',
//             routerLink: this.mainRoutes.expensesList,
//           },
//           {
//             label: 'transactions',
//             icon: 'pi pi-receipt',
//             routerLink: this.mainRoutes.transactionsList,
//           },
//           {
//             label: 'shippingData',
//             icon: 'pi pi-cart-arrow-down',
//             routerLink: this.mainRoutes.shippingDataList,
//           },
//           {
//             label: 'year',
//             icon: 'pi pi-calendar-clock',
//             routerLink: this.mainRoutes.yearList,
//           },
//         ],
//       },
//       {
//         label: 'invoices',
//         items: [
//           {
//             label: 'invoices',
//             icon: 'pi pi-receipt',
//             routerLink: this.mainRoutes.invoicesList,
//           },
//         ],
//       },
//       {
//         label: 'reports',
//         items: [],
//       },
//       {
//         label: 'profile',
//         items: [
//           {
//             label: 'settings',
//             icon: 'pi pi-cog',
//             routerLink: this.mainRoutes.settings,
//           },
//           {
//             label: 'logout',
//             icon: 'pi pi-sign-out',
//             routerLink: this.authRoutes.LOGIN,
//           },
//         ],
//       },
//       { separator: true },
//     ];
//   }
// }

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
        label: 'Home',
        icon: 'pi pi-home',
        styleClass: 'menu-header',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-chart-line',
            routerLink: this.mainRoutes.home,
            styleClass: 'menu-item',
            command: () => this.handleNavigation(),
          },
        ],
      },
      {
        label: 'Master Data',
        icon: 'pi pi-database',
        styleClass: 'menu-header',
        items: [
          { label: 'Customers', icon: 'pi pi-users', routerLink: this.mainRoutes.customersList },
          { label: 'Suppliers', icon: 'pi pi-truck', routerLink: this.mainRoutes.suppliersList },
          { label: 'Categories', icon: 'pi pi-th-large', routerLink: this.mainRoutes.itemsCategoryList },
          { label: 'Payments', icon: 'pi pi-wallet', routerLink: this.mainRoutes.paymentsList },
          { label: 'Expenses', icon: 'pi pi-dollar', routerLink: this.mainRoutes.expensesList },
          { label: 'Transactions', icon: 'pi pi-exchange', routerLink: this.mainRoutes.transactionsList },
          { label: 'Shipping', icon: 'pi pi-truck', routerLink: this.mainRoutes.shippingDataList },
          { label: 'Years', icon: 'pi pi-calendar', routerLink: this.mainRoutes.yearList },
        ].map(item => ({
          ...item,
          styleClass: 'menu-item',
          command: () => this.handleNavigation(),
        })),
      },
      {
        label: 'Invoices',
        icon: 'pi pi-file',
        styleClass: 'menu-header',
        items: [
          {
            label: 'All Invoices',
            icon: 'pi pi-list',
            routerLink: this.mainRoutes.invoicesList,
            styleClass: 'menu-item',
            command: () => this.handleNavigation(),
          },
        ],
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        styleClass: 'menu-header',
        items: [], // Add report items as needed
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        styleClass: 'menu-header',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            routerLink: this.mainRoutes.settings,
            styleClass: 'menu-item',
          },
          {
            label: 'Logout',
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