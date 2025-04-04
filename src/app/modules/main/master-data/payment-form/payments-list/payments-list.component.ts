import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { PaymentService } from '../payment.service';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-payments-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    TableModule,
    Skeleton,
  ],
  templateUrl: './payments-list.component.html',
  styles: ``,
})
export default class PaymentsListComponent {
  languageService = inject(LanguagesService);
  PaymentService = inject(PaymentService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading: boolean = false;

  constructor() {
    effect(() => {
      this.PaymentService.paymentDeleted();
      this.getPaymentList();
      this.PaymentService.paymentDeleted.set(false);
    });
  }

  getPaymentList(page: number = 1, size: number = 10) {
    this.isLoading = true;
    this.PaymentService.getList(page, size).subscribe(
      (data: any) => {
        this.tableColumns = this.PaymentService.PaymentHeaders;
        this.displayedColumns = this.PaymentService.PaymentHeaders;
        this.dataSource = this.PaymentService.apiModelToComponentModelList(
          data.results
        );
        this.isLoading = false;
      },
      () => {
        this.isLoading = false; // Handle error case
      }
    );
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
