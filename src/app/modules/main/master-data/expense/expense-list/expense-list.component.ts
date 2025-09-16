import { Component, effect, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ExpenseService } from '../expense.service';
import { Skeleton } from 'primeng/skeleton';
import { UserPermissionService } from '../../../../../services/user-permission.service';
import { PaginationService } from '../../../../../core/services/pagination.service';

@Component({
  selector: 'app-expense-list',
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
  templateUrl: './expense-list.component.html',
})
export default class ExpenseListComponent {
  languageService = inject(LanguagesService);
  ExpenseService = inject(ExpenseService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  userPermissionService = inject(UserPermissionService);
  private paginationService = inject(PaginationService);
  
  dataSource: any[] = [];

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = false;
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }
  filterForm: FormGroup = this.formBuilder.group({
    customer_name: [''],
    container_sequence: [''],
  });

  constructor() {
    // Load initial data
    this.getExpenseList();
    
    effect(() => {
      this.ExpenseService.expenseDeleted();
      this.getExpenseList();
      this.ExpenseService.expenseDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getExpenseList(this.page, this.rows, filterData);
  }

  getExpenseList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true;
    this.ExpenseService.getList(page, size, filterData).subscribe(
      (data: any) => {
        this.tableColumns = this.ExpenseService.ExpenseHeaders;
        this.displayedColumns = this.ExpenseService.ExpenseHeaders;
        this.dataSource = this.ExpenseService.apiModelToComponentModelList(
          data.results
        );
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.getRawValue();
    this.getExpenseList(paginationState.page, paginationState.rows, filterData);
  }

  editExpense(expenseId: any) {
    this.router.navigate([`/${main_routes_paths.expenses}`], {
      queryParams: { expenseId: expenseId, edit: true },
    });
  }
  deleteExpense(id: string) {
    this.ExpenseService.deleteExpense(id);
  }
  viewExpense(expenseId: string) {
    this.router.navigate([`/${main_routes_paths.expenses}`], {
      queryParams: { expenseId: expenseId, edit: false },
    });
  }
}
