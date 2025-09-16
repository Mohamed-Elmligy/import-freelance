import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { PaymentService } from '../payment.service';
import { PaginationService } from '../../../../../core/services/pagination.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './payments-list.component.html',
})
export default class PaymentsListComponent {
  languageService = inject(LanguagesService);
  PaymentService = inject(PaymentService);
  securityService = inject(SecurityService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private paginationService = inject(PaginationService);

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading: boolean = false;
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }
  filterForm: FormGroup = this.formBuilder.group({
    customer_name: [''],
    customer_code: [''],
  });

  constructor() {
    // Initialize pagination for this component
    this.paginationService.initializeForComponent();
    // Load initial data
    this.getPaymentList();
    
    effect(() => {
      this.PaymentService.paymentDeleted();
      this.getPaymentList();
      this.PaymentService.paymentDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getPaymentList(this.page, this.rows, filterData);
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.getRawValue();
    this.getPaymentList(paginationState.page, paginationState.rows, filterData);
  }

  getPaymentList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true;
    this.PaymentService.getList(page, size, filterData).subscribe(
      (data: any) => {
        this.tableColumns = this.PaymentService.PaymentHeaders;
        this.displayedColumns = this.PaymentService.PaymentHeaders;
        this.dataSource = this.PaymentService.apiModelToComponentModelList(
          data.results
        );
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
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
