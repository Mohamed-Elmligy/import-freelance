import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { TooltipModule } from 'primeng/tooltip';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-customer-list',
  imports: [
    ButtonModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
  ],
  templateUrl: './customer-list.component.html',
  styles: ``,
})
export default class CustomerListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  customerService = inject(CustomersService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<any>;

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  constructor() {
    effect(() => {
      this.customerService.customerDeleted();
      this.getCustomersList();
      this.customerService.customerDeleted.set(false);
    });
  }

  getCustomersList() {
    this.customerService.getList().subscribe((data: any) => {
      this.tableColumns = this.customerService.customerHeaders;
      this.displayedColumns = this.customerService.customerHeaders;
      let ModifideData: any = this.customerService.apiModelToComponentModelList(
        data.results
      );
      this.dataSource = new MatTableDataSource<any>(ModifideData);
      this.resultsLength = data.count;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
