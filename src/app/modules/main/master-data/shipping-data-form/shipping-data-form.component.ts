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
import { SelectModule } from 'primeng/select';
import { LookupsService } from '../../../shared/services/lookups.service';
import { ShippingDataService } from './shipping-data.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
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
    SelectModule,
    TextareaModule,
    PageHeaderComponent,
  ],
  templateUrl: './shipping-data-form.component.html',
})
export default class ShippingDataFormComponent {
  mainPaths = main_routes_paths;
  route: MenuItem[] = [];
  listOfCustomers = signal([]);

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private lookupService = inject(LookupsService);
  private shippingDataService = inject(ShippingDataService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  shippingId = this.activatedRoute.snapshot.queryParams['shippingId'];

  shippingData: {
    customer: string;
    container_number: string;
    shipping_date: string;
    container_sequence: number;
    port_name: string;
  } = {
    customer: '',
    container_number: '',
    shipping_date: '',
    container_sequence: 0,
    port_name: '',
  };

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    containerSequence: [
      null,
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    containerNumber: [null, [Validators.required]],
    ShippingDate: [null, [Validators.required]],
    port: [null, []],
    description: [null, []],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.shippingDataService.createShipping(form);
      else this.shippingDataService.updateShipping(form, this.shippingId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }

  ngOnInit() {
    this.lookupService.getListOfLookups('customers').subscribe((data: any) => {
      this.listOfCustomers.set(data);
      this.shippingDataService.listOfCustomers.set(data);
    });

    this.route = [
      {
        icon: 'pi pi-cart-arrow-down',
        route: this.mainPaths.shippingDataList,
        queryParams: { type: 'shippingData' },
      },
      { label: 'shippingData', route: this.mainPaths.shippingData },
    ];

    if (this.shippingId && !this.isUpdate) this.getExpenseById();
    if (this.shippingId && this.isUpdate) this.updateExpense();
  }

  getExpenseById() {
    this.shippingDataService
      .getShippingById(this.shippingId)
      .subscribe((data: any) => {
        this.shippingData = data;
      });
  }
  updateExpense() {
    if (this.isUpdate) {
      this.shippingDataService
        .getShippingByIdForUpdate(this.shippingId)
        .subscribe((data) => {
          this.shippingDataService.apiModelToComponentModel(this.form, data);
        });
    }
  }
}
