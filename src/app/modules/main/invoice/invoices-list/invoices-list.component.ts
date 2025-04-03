import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table'; // Added PrimeNG TableModule
import { SecurityService } from '../../../../core/services/security.service';
import { LanguagesService } from '../../../shared/services/languages.service';
import { main_routes_paths } from '../../main.routes';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoices-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    TableModule, // Added PrimeNG TableModule
  ],
  templateUrl: './invoices-list.component.html',
  styles: ``,
})
export default class InvoicesListComponent {
  languageService = inject(LanguagesService);
  invoiceService = inject(InvoiceService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = []; // Changed to a simple array
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  constructor() {
    effect(() => {
      this.invoiceService.invoiceDeleted();
      this.getInvoicesList();
      this.invoiceService.invoiceDeleted.set(false);
    });
  }

  getInvoicesList(page: number = 1, size: number = 10) {
    this.invoiceService.getList(page, size).subscribe((data: any) => {
      this.tableColumns = this.invoiceService.invoiceHeaders;
      this.displayedColumns = [...this.invoiceService.invoiceHeaders];
      this.dataSource = this.invoiceService.apiModelToComponentModelList(
        data.results
      );
      this.resultsLength = data.count;
    });
  }

  editInvoice(invoiceId: any) {
    this.router.navigate([`/${main_routes_paths.invoices}`], {
      queryParams: { invoiceId: invoiceId, edit: true },
    });
  }

  deleteInvoice(id: string) {
    this.invoiceService.deleteInvoice(id);
  }

  viewInvoice(invoiceId: string) {
    this.router.navigate([`/${main_routes_paths.invoices}`], {
      queryParams: { invoiceId: invoiceId, edit: false },
    });
  }
}
