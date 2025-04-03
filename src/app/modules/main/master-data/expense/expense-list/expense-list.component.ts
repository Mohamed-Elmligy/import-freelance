import { Component, effect, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './expense-list.component.html',
  styles: ``,
})
export default class ExpenseListComponent {
  languageService = inject(LanguagesService);
  ExpenseService = inject(ExpenseService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = [];

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  constructor() {
    effect(() => {
      this.ExpenseService.expenseDeleted();
      this.getExpenseList();
      this.ExpenseService.expenseDeleted.set(false);
    });
  }

  getExpenseList(page: number = 1, size: number = 10) {
    this.ExpenseService.getList(page, size).subscribe((data: any) => {
      this.tableColumns = this.ExpenseService.ExpenseHeaders;
      this.displayedColumns = this.ExpenseService.ExpenseHeaders;
      this.dataSource = this.ExpenseService.apiModelToComponentModelList(
        data.results
      );
      this.resultsLength = data.count;
    });
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
