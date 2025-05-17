import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { main_routes_paths } from '../../main.routes';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaModule } from 'primeng/textarea';
import { RepaymentService } from './repayment.service';
import { LookupsService } from '../../../shared/services/lookups.service';
import { SelectModule } from 'primeng/select';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-repayments-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePicker,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    TextareaModule,
    SelectModule,
    PageHeaderComponent,
    TableModule,
    MessageModule,
    InputNumberModule,
  ],
  templateUrl: './repayments-form.component.html',
})
export default class RepaymentsFormComponent {
  mainPaths = main_routes_paths;
  route: MenuItem[] = [];
  listOfInvoices = signal([]);
  invoiceData = signal<InvoiceData>({
    id: '',
    invoice_number: '',
    customer: '',
    supplier: '',
    invoice_date: '',
    total_amount: '',
    discount_amount: '',
    net_amount: '',
  });
  paymentData = signal<{
    invoice_number: string;
    available_payments: [
      {
        payment_number: string;
        amount: number;
        date: string;
      }
    ];
  }>({
    invoice_number: '',
    available_payments: [
      {
        payment_number: '',
        amount: 0,
        date: '',
      },
    ],
  });

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  public transactionService = inject(RepaymentService);
  private lookupsService = inject(LookupsService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  transactionId = this.activatedRoute.snapshot.queryParams['transactionId'];

  transactionData: {
    customer: string;
    supplier: string;
    amount: number;
    pay_date: Date;
    invoice_payment_number: string;
    description: string;
  } = {
    customer: '',
    supplier: '',
    amount: 0,
    pay_date: new Date(),
    invoice_payment_number: '',
    description: '',
  };

  protected form = this.formBuilder.group({
    invoiceNumber: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    transactionDate: [null, [Validators.required]],
    invoice_payment_number: [null, [Validators.required]],
    description: [null, []],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) {
        this.transactionService.createTransaction(form);
      } else {
        this.transactionService.updateTransaction(form, this.transactionId);
      }
    }
  }

  reset(form: FormGroup) {
    form.reset();
    this.paymentData.set({
      invoice_number: '',
      available_payments: [{ payment_number: '', amount: 0, date: '' }],
    });
    this.invoiceData.set({
      id: '',
      invoice_number: '',
      customer: '',
      supplier: '',
      invoice_date: '',
      total_amount: '',
      discount_amount: '',
      net_amount: '',
    });
  }

  ngOnInit() {
    this.lookupsService.getListOfLookups('invoices').subscribe((data) => {
      this.listOfInvoices.set(data);
      this.transactionService.listOfInvoices.set(data);
    });
    this.route = [
      {
        icon: 'pi pi-receipt',
        route: this.mainPaths.transactionsList,
        queryParams: { type: 'transactions' },
      },
      { label: 'transactions', route: this.mainPaths.transactions },
    ];

    if (this.transactionId && !this.isUpdate) this.getTransactionById();
    if (this.transactionId && this.isUpdate) this.updateTransaction();
  }

  getInvoiceData(id: string) {
    this.transactionService.getInvoiceData(id).subscribe((data: any) => {
      this.invoiceData.set(data);
    });
  }

  getPaymentData(id: string) {
    this.transactionService.getPaymentData(id).subscribe((data: any) => {
      this.paymentData.set(data);
      this.transactionService.paymentBatchies.set(data.available_payments);
    });
  }

  getTransactionById() {
    this.transactionService
      .getTransactionById(this.transactionId)
      .subscribe((data: any) => {
        this.transactionData = data;
      });
  }

  updateTransaction() {
    if (this.isUpdate) {
      this.transactionService
        .getTransactionByIdForUpdate(this.transactionId)
        .subscribe((data) => {
          this.transactionService.apiModelToComponentModel(this.form, data);
        });
    }
  }
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  customer: string;
  supplier: string;
  invoice_date: string;
  total_amount: string;
  discount_amount: string;
  net_amount: string;
}
