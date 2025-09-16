import { Component, effect, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table'; // Added PrimeNG TableModule
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { RepaymentService } from '../repayment.service';
import { Skeleton } from 'primeng/skeleton';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserPermissionService } from '../../../../../services/user-permission.service';
import { PaginationService } from '../../../../../core/services/pagination.service';

@Component({
  selector: 'app-repayments-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    TableModule,
    Skeleton,
    ReactiveFormsModule,
  ],
  templateUrl: './repayments-list.component.html',
})
export default class RepaymentsListComponent {
  languageService = inject(LanguagesService);
  TransactionService = inject(RepaymentService);
  securityService = inject(SecurityService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  userPermissionService = inject(UserPermissionService);
  private paginationService = inject(PaginationService);

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading: boolean = false; // Add loading state
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }

  filterForm: FormGroup = this.formBuilder.group({
    customer_name: [''],
    supplier_name: [''],
  });

  constructor() {
    // Load initial data
    this.getTransactionList();
    
    effect(() => {
      this.TransactionService.transactionDeleted();
      this.getTransactionList();
      this.TransactionService.transactionDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getTransactionList(this.page, this.rows, filterData);
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.getRawValue();
    this.getTransactionList(paginationState.page, paginationState.rows, filterData);
  }

  getTransactionList(
    page: number = 1,
    size: number = 10,
    filterData: any = {}
  ) {
    this.isLoading = true; // Set loading to true
    this.TransactionService.getList(page, size, filterData).subscribe(
      (data: any) => {
        this.tableColumns = this.TransactionService.TransactionHeaders;
        this.displayedColumns = this.TransactionService.TransactionHeaders;
        this.dataSource = this.TransactionService.apiModelToComponentModelList(
          data.results
        );
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
        this.isLoading = false; // Set loading to false after data is fetched
      },
      () => {
        this.isLoading = false; // Set loading to false on error
      }
    );
  }

  editTransaction(transactionId: any) {
    this.router.navigate([`/${main_routes_paths.transactions}`], {
      queryParams: { transactionId: transactionId, edit: true },
    });
  }
  deleteTransaction(id: string) {
    this.TransactionService.deleteTransaction(id);
  }
  viewTransaction(transactionId: string) {
    this.router.navigate([`/${main_routes_paths.transactions}`], {
      queryParams: { transactionId: transactionId, edit: false },
    });
  }
}
