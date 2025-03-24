import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, effect, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expense-list',
  imports: [
    ButtonModule,
    RouterModule,
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
    TooltipModule
],
  templateUrl: './expense-list.component.html',
  styles: ``,
})
export default class ExpenseListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  ExpenseService = inject(ExpenseService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  readonly paginator = viewChild.required(MatPaginator);
  dataSource!: MatTableDataSource<any>;

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

  getExpenseList() {
    this.ExpenseService.getList().subscribe((data: any) => {
      this.tableColumns = this.ExpenseService.ExpenseHeaders;
      this.displayedColumns = this.ExpenseService.ExpenseHeaders;
      let ModifideData = this.ExpenseService.apiModelToComponentModelList(
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
