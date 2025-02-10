import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { main_routes_paths } from '../../main.routes';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-shipping-data-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePicker,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './shipping-data-form.component.html',
})
export default class ShippingDataFormComponent {
  mainPaths = main_routes_paths;
  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-cart-arrow-down',
        route: this.mainPaths.data,
        queryParams: { type: 'shipping' },
      },
      { label: 'payment form', route: this.mainPaths.payments },
    ];
  }
}
