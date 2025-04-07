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

  dataSource: any[] = [];

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = false;

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  page: number = 1;
  filterForm: FormGroup = this.formBuilder.group({
    name: [''],
    container_sequence: [''],
  });

  constructor() {
    effect(() => {
      this.ExpenseService.expenseDeleted();
      this.getExpenseList();
      this.ExpenseService.expenseDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    this.getExpenseList(this.first + 1, this.rows, filterData);
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
        this.totalRecords = data.count;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.first / event.rows + 1;
    this.getExpenseList(this.page, event.rows);
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
