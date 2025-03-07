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
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'app-shipping-data-form',
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
  templateUrl: './shipping-data-form.component.html',
})
export default class ShippingDataFormComponent {
  mainPaths = main_routes_paths;
  items: MenuItem[] | undefined;

  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    contatierSequance: [null, [Validators.required]],
    containerNumber: [null, [Validators.required]],
    ShippingDate: [null, [Validators.required]],
    port: [null, [Validators.required]],
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
        icon: 'pi pi-cart-arrow-down',
        route: this.mainPaths.shippingDataList,
        queryParams: { type: 'shippingData' },
      },
      { label: 'shippingData', route: this.mainPaths.shippingData },
    ];
  }
}
