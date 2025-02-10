import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { main_routes_paths } from '../../../main/main.routes';
import { auth_routes_paths } from '../../../auth/auth.routes';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
        label: 'invoice',
        items: [
          {
            label: 'createInvoice',
            icon: 'pi pi-receipt',
            routerLink: this.mainRoutes.createInvoice,
          },
        ],
      },
      {
        label: 'reports',
        items: [
          {
            label: 'Client financial report',
            icon: 'pi pi-file-export',
          },
          {
            label: 'Supplier Financial Report',
            icon: 'pi pi-file-export',
          },
          {
            label: 'Overall report',
            icon: 'pi pi-file-export',
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
