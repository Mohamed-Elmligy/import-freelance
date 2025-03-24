import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { PaymentService } from '../payment.service';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-payments-list',
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
  templateUrl: './payments-list.component.html',
  styles: ``,
})
export default class PaymentsListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  PaymentService = inject(PaymentService);
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
      this.PaymentService.paymentDeleted();
      this.getPaymentList();
      this.PaymentService.paymentDeleted.set(false);
    });
  }

  getPaymentList() {
    this.PaymentService.getList().subscribe((data: any) => {
      this.tableColumns = this.PaymentService.PaymentHeaders;
      this.displayedColumns = this.PaymentService.PaymentHeaders;
      let ModifideData = this.PaymentService.apiModelToComponentModelList(
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

  editPayment(paymentId: any) {
    this.router.navigate([`/${main_routes_paths.payments}`], {
      queryParams: { paymentId: paymentId, edit: true },
    });
  }
  deletePayment(id: string) {
    this.PaymentService.deletePayment(id);
  }
  viewPayment(paymentId: string) {
    this.router.navigate([`/${main_routes_paths.payments}`], {
      queryParams: { paymentId: paymentId, edit: false },
    });
  }
}
