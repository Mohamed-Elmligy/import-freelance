import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { CustomersService } from '../customers.service';
import { Skeleton } from 'primeng/skeleton';
import { UserPermissionService } from '../../../../../services/user-permission.service';
import { PaginationService } from '../../../../../core/services/pagination.service';

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
    ReactiveFormsModule,
  ],
  templateUrl: './customer-list.component.html',
})
export default class CustomerListComponent {
  languageService = inject(LanguagesService);
  customerService = inject(CustomersService);
  userPernissions = inject(UserPermissionService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private paginationService = inject(PaginationService);
  
  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = true;
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }

  filterForm: FormGroup = this.formBuilder.group({
    name: [''],
    code: [''],
  });

  constructor() {
    // Initialize pagination for this component
    this.paginationService.initializeForComponent();
    // Load initial data
    this.getCustomersList();
    
    effect(() => {
      this.customerService.customerDeleted();
      this.getCustomersList();
      this.customerService.customerDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.value;
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getCustomersList(this.page, this.rows, filterData);
  }

  getCustomersList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true;
    this.customerService
      .getList(page, size, filterData)
      .subscribe((data: any) => {
        this.tableColumns = this.customerService.customerHeaders;
        this.displayedColumns = this.customerService.customerHeaders;
        let ModifideData: any =
          this.customerService.apiModelToComponentModelList(data.results);
        this.dataSource = ModifideData;
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
        this.isLoading = false;
      });
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.value;
    this.getCustomersList(paginationState.page, paginationState.rows, filterData);
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
