import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-sidebar',
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
})
export default class SidebarComponent {
  items: MenuItem[] | undefined;
  mainRoutes = main_routes_paths;
  authRoutes = auth_routes_paths;
  ngOnInit() {
    this.items = [
      {
        separator: true,
      },
      {
        label: 'masterData',
        items: [
          {
            label: 'home',
            icon: 'pi pi-home',
            routerLink: this.mainRoutes.home,
          },
          {
            label: 'customers',
            icon: 'pi pi-users',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'customers' },
          },
          {
            label: 'suppliers',
            icon: 'pi pi-truck',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'suppliers' },
          },
          {
            label: 'itemsCategory',
            icon: 'pi pi-objects-column',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'itemsCategory' },
          },
          {
            label: 'payments',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'payments' },
          },
          {
            label: 'expenses',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'expenses' },
          },
          {
            label: 'transactions',
            icon: 'pi pi-receipt',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'transactions' },
          },

          {
            label: 'shippingData',
            icon: 'pi pi-cart-arrow-down',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'shippingData' },
          },
        ],
      },
      {
        label: 'invoices',
        items: [
          {
            label: 'invoices',
            icon: 'pi pi-receipt',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'invoices' },
          },
        ],
      },
      {
        label: 'reports',
        items: [
          {
            label: 'shipmantReport',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'shipmantReport', report: 'true' },
          },
          {
            label: 'totalPayments',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'totalPayments', report: 'true' },
          },
          {
            label: 'totalBalance',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'totalBalance', report: 'true' },
          },
          {
            label: 'totalExpenses',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'totalExpenses', report: 'true' },
          },
          {
            label: 'totalPaids',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'totalPaids', report: 'true' },
          },
          {
            label: 'officeBalance',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'officeBalance', report: 'true' },
          },
        ],
      },
      {
        label: 'profile',
        items: [
          {
            label: 'settings',
            icon: 'pi pi-cog',
            routerLink: this.mainRoutes.settings,
          },
          {
            label: 'logout',
            icon: 'pi pi-sign-out',
            routerLink: this.authRoutes.LOGIN,
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }
}
