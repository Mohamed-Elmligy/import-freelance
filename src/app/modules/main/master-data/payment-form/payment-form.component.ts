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
import { TextareaModule } from 'primeng/textarea';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { LookupsService } from '../../../shared/services/lookups.service';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePicker,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TextareaModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './payment-form.component.html',
})
export default class PaymentFormComponent {
  mainPaths = main_routes_paths;
  items: MenuItem[] | undefined;
  selectedCountry: string | undefined;
  listOfCustomers = signal([]);

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private lookupService = inject(LookupsService);
  private paymentService = inject(PaymentService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  paymentId = this.activatedRoute.snapshot.queryParams['paymentId'];

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    paymentDate: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  paymentData: {
    customer: string;
    amount: string;
    payment_date: Date;
    description: string;
    name: string;
  } = {
    amount: '',
    customer: '',
    payment_date: new Date(),
    description: '',
    name: '',
  };

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.paymentService.createPayment(form);
      else this.paymentService.updatePayment(form, this.paymentId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }

  ngOnInit() {
    this.lookupService.getListOfLookups('customers').subscribe((data: any) => {
      this.listOfCustomers.set(data);
      this.paymentService.listOfCustomers.set(data);
    });
    this.items = [
      {
        icon: 'pi pi-wallet',
        route: this.mainPaths.paymentsList,
        queryParams: { type: 'payments' },
      },
      { label: 'payments', route: this.mainPaths.payments },
    ];

    if (this.paymentId && !this.isUpdate) this.getPaymentById();
    if (this.paymentId && this.isUpdate) this.updatePayment();
  }

  getPaymentById() {
    this.paymentService
      .getPaymentById(this.paymentId)
      .subscribe((data: any) => {
        this.paymentData = data;
      });
  }
  
  updatePayment() {
    if (this.isUpdate) {
      this.paymentService.getPaymentById(this.paymentId).subscribe((data) => {
        this.paymentService.apiModelToComponentModel(this.form, data);
      });
    }
  }
}
