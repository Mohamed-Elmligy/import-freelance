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
  ],
  templateUrl: './repayments-form.component.html',
})
export default class RepaymentsFormComponent {
  mainPaths = main_routes_paths;
  route: MenuItem[] = [];
  listOfInvoices = signal([]);

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private transactionService = inject(RepaymentService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  transactionId = this.activatedRoute.snapshot.queryParams['transactionId'];

  transactionData: {
    amount: number;
    customer: string;
    discription: string;
    pay_date: Date;
    supplier: string;
  } = {
    amount: 0,
    customer: '',
    discription: '',
    pay_date: new Date(),
    supplier: '',
  };

  protected form = this.formBuilder.group({
    customer: [null, [Validators.required]],
    invoiceNumber: [null, [Validators.required]],
    supplierNumber: [null, [Validators.required]],
    remainingAmount: [null, [Validators.required]],
    transactionDate: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  submit(form: FormGroup) {
    console.log(form.controls);
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
  }

  ngOnInit() {
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

  getInvoiceDataLookup() {
    this.api;
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
