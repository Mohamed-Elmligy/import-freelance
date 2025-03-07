import { Component, inject } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { main_routes_paths } from '../../main.routes';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { cities, City } from '../payment-form/payment-form.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
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
    MultiSelectModule,
    TextareaModule,
  ],
  templateUrl: './repayments-form.component.html',
})
export default class RepaymentsFormComponent {
  cities!: City[];
  mainPaths = main_routes_paths;
  items: MenuItem[] | undefined;

  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    invoiceNumber: [null, [Validators.required]],
    supplierName: [null, [Validators.required]],
    batch: [null, [Validators.required]],
    remainingAmount: [null, [Validators.required]],
    transactionDate: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  submit(form: FormGroup) {
    console.log(form.value);
  }

  reset(form: FormGroup) {
    form.reset();
  }

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-receipt',
        route: this.mainPaths.transactionsList,
        queryParams: { type: 'transactions' },
      },
      { label: 'transactions', route: this.mainPaths.transactions },
    ];
    this.cities = cities;
  }
}
