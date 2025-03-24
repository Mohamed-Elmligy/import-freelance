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
import { SecurityService } from '../../../../core/services/security.service';
import { LanguagesService } from '../../../shared/services/languages.service';
import { main_routes_paths } from '../../main.routes';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoices-list',
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
  templateUrl: './invoices-list.component.html',
  styles: ``,
})
export default class InvoicesListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  invoiceService = inject(InvoiceService);
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
      this.invoiceService.invoiceDeleted();
      this.getInvoicesList();
      this.invoiceService.invoiceDeleted.set(false);
    });
  }

  getInvoicesList() {
    this.invoiceService.getList().subscribe((data: any) => {
      this.tableColumns = this.invoiceService.invoiceHeaders;
      this.displayedColumns = [...this.invoiceService.invoiceHeaders];
      const modifiedData = this.invoiceService.apiModelToComponentModelList(data.results);
      this.dataSource = new MatTableDataSource<any>(modifiedData);
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
