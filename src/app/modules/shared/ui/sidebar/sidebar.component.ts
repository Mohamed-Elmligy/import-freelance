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
        label: 'Actions',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: this.mainRoutes.home,
          },
          {
            label: 'Payments',
            icon: 'pi pi-wallet',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'payment' },
          },
          {
            label: 'Expense',
            icon: 'pi pi-dollar',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'expense' },
          },
          {
            label: 'Partial Repayments',
            icon: 'pi pi-receipt',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'partial' },
          },

          {
            label: 'Shipping Data',
            icon: 'pi pi-cart-arrow-down',
            routerLink: this.mainRoutes.data,
            queryParams: { type: 'shipping' },
          },
        ],
      },
      {
        label: 'Reports',
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
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2',
          },
          {
            label: 'Logout',
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
