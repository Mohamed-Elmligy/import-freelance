import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, ViewChild } from '@angular/core';
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
import { RepaymentService } from '../repayment.service';

@Component({
  selector: 'app-repayments-list',
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
  templateUrl: './repayments-list.component.html',
  styles: ``,
})
export default class RepaymentsListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  TransactionService = inject(RepaymentService);
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
      this.TransactionService.transactionDeleted();
      this.getTransactionList();
      this.TransactionService.transactionDeleted.set(false);
    });
  }

  getTransactionList() {
    this.TransactionService.getList().subscribe((data: any) => {
      this.tableColumns = this.TransactionService.TransactionHeaders;
      this.displayedColumns = this.TransactionService.TransactionHeaders;
      let ModifideData = this.TransactionService.apiModelToComponentModelList(
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
