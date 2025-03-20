import { Component, inject, OnInit } from '@angular/core';
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
  public securityService = inject(SecurityService);
  ngOnInit() {
    this.items = [
      {
        separator: true,
      },
      {
        label: 'home',
        items: [
          {
            label: 'home',
            icon: 'pi pi-home',
            routerLink: this.mainRoutes.home,
          },
        ],
      },
      {
        label: 'masterData',
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
            icon: 'pi pi-objects-column',
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
            icon: 'pi pi-receipt',
            routerLink: this.mainRoutes.transactionsList,
          },

          {
            label: 'shippingData',
            icon: 'pi pi-cart-arrow-down',
            routerLink: this.mainRoutes.shippingDataList,
          },
          {
            label: 'year',
            icon: 'pi pi-calendar-clock',
            routerLink: this.mainRoutes.yearList,
          },
        ],
      },
      {
        label: 'invoices',
        items: [
          {
            label: 'invoices',
            icon: 'pi pi-receipt',
            routerLink: this.mainRoutes.invoicesList,
          },
        ],
      },
      {
        label: 'reports',
        items: [
          {
            label: 'shipmantReport',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.customersList,
            queryParams: { type: 'shipmantReport', report: 'true' },
          },
          {
            label: 'totalPayments',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.customersList,
            queryParams: { type: 'totalPayments', report: 'true' },
          },
          {
            label: 'totalBalance',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.customersList,
            queryParams: { type: 'totalBalance', report: 'true' },
          },
          {
            label: 'totalExpenses',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.customersList,
            queryParams: { type: 'totalExpenses', report: 'true' },
          },
          {
            label: 'totalPaids',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.customersList,
            queryParams: { type: 'totalPaids', report: 'true' },
          },
          {
            label: 'officeBalance',
            icon: 'pi pi-file-excel',
            routerLink: this.mainRoutes.customersList,
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
