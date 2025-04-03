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
    TableModule, // Added PrimeNG TableModule
  ],
  templateUrl: './repayments-list.component.html',
  styles: ``,
})
export default class RepaymentsListComponent {
  languageService = inject(LanguagesService);
  TransactionService = inject(RepaymentService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = []; // Changed to array for PrimeNG table
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

  getTransactionList(page: number = 1, size: number = 10) {
    this.TransactionService.getList(page, size).subscribe((data: any) => {
      this.tableColumns = this.TransactionService.TransactionHeaders;
      this.displayedColumns = this.TransactionService.TransactionHeaders;
      this.dataSource = this.TransactionService.apiModelToComponentModelList(
        data.results
      );
      this.resultsLength = data.count;
    });
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
