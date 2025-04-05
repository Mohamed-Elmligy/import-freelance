import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { CustomersService } from '../customers.service';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    TableModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    Skeleton,
  ],
  templateUrl: './customer-list.component.html',
})
export default class CustomerListComponent {
  languageService = inject(LanguagesService);
  customerService = inject(CustomersService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = true;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor() {
    effect(() => {
      this.customerService.customerDeleted();
      this.getCustomersList();
      this.customerService.customerDeleted.set(false);
    });
  }

  getCustomersList(page: number = 1, size: number = 10) {
    this.isLoading = true;
    this.customerService.getList(page, size).subscribe((data: any) => {
      this.tableColumns = this.customerService.customerHeaders;
      this.displayedColumns = this.customerService.customerHeaders;
      let ModifideData: any = this.customerService.apiModelToComponentModelList(
        data.results
      );
      this.dataSource = ModifideData;
      this.totalRecords = data.count;
      this.isLoading = false;
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.getCustomersList(event.first + 1, event.rows);
  }

  editCustomer(customerId: any) {
    this.router.navigate([`/${main_routes_paths.customers}`], {
      queryParams: { customerId: customerId, edit: true },
    });
  }

  deleteCustomer(id: string) {
    this.customerService.deleteCustomer(id);
  }

  viewCustomer(customerId: string) {
    this.router.navigate([`/${main_routes_paths.customers}`], {
      queryParams: { customerId: customerId, edit: false },
    });
  }
}
