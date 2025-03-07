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
import { TranslateModule } from '@ngx-translate/core';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { cities, City } from '../payment-form/payment-form.component';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-expense-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePicker,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    TextareaModule,
    TranslateModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './expense-form.component.html',
})
export default class ExpenseFormComponent {
  cities!: City[];
  mainPaths = main_routes_paths;
  items: MenuItem[] | undefined;
  selectedCountry: string | undefined;

  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    containerNumber: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    expenseDate: [null, [Validators.required]],
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
        icon: 'pi pi-dollar',
        route: this.mainPaths.expensesList,
        queryParams: { type: 'expenses' },
      },
      { label: 'expenses', route: this.mainPaths.expenses },
    ];
    this.cities = cities;
  }
}
