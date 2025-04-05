import { Component, effect, inject } from '@angular/core';
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
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table'; // Added PrimeNG TableModule
import { SecurityService } from '../../../../core/services/security.service';
import { LanguagesService } from '../../../shared/services/languages.service';
import { main_routes_paths } from '../../main.routes';
import { InvoiceService } from '../invoice.service';
import { SkeletonModule } from 'primeng/skeleton';

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
    SkeletonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './invoices-list.component.html',
})
export default class InvoicesListComponent {
  languageService = inject(LanguagesService);
  invoiceService = inject(InvoiceService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  dataSource: any[] = []; // Changed to a simple array
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = true; // Add isLoading property
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  filterForm: FormGroup = this.formBuilder.group({
    name: [''],
    invoiceDate: [''],
    supplier_name: [''],
    invoiceNumber: [''],
  });

  constructor() {
    effect(() => {
      this.invoiceService.invoiceDeleted();
      this.getInvoicesList();
      this.invoiceService.invoiceDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.value;
    //format date to YYYY-MM-DD
    if (filterData.invoiceDate) {
      filterData.invoiceDate = filterData.invoiceDate
        .toISOString()
        .split('T')[0];
    }
    this.getInvoicesList(this.first + 1, this.rows, filterData);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.getInvoicesList(event.first + 1, event.rows);
  }

  getInvoicesList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true; // Set loading to true
    this.invoiceService
      .getList(page, size, filterData)
      .subscribe((data: any) => {
        this.tableColumns = this.invoiceService.invoiceHeaders;
        this.displayedColumns = [...this.invoiceService.invoiceHeaders];
        this.dataSource = this.invoiceService.apiModelToComponentModelList(
          data.results
        );
        this.totalRecords = data.count;
        this.isLoading = false; // Set loading to false after data is fetched
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
