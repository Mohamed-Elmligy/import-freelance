import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { main_routes_paths } from '../../main.routes';
import { TextareaModule } from 'primeng/textarea';
import { CustomersService } from './customers.service';

@Component({
  selector: 'app-customers',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  templateUrl: './customers.component.html',
  styles: ``,
})
export default class CustomersComponent {
  items: MenuItem[] | undefined;
  mainPaths = main_routes_paths;

  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private customersService = inject(CustomersService);

  customerData: {
    id: number;
    name: string;
    email: string;
    code: number;
    commession: string;
    description: string;
  } = { id: 0, name: '', email: '', code: 0, commession: '', description: '' };

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  customerId = this.activatedRoute.snapshot.queryParams['customerId'];

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    customerCode: [null, [Validators.required]],
    commission: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.customersService.createCustomer(form);
      else this.customersService.updateCustomer(form, this.customerId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit() {
    this.items = [
      {
        icon: 'pi  pi-users',
        route: this.mainPaths.customersList,
        queryParams: { type: 'customers' },
      },
      { label: 'customers', route: this.mainPaths.customers },
    ];
    if (this.customerId && !this.isUpdate) this.getCustomerById();
    if (this.customerId && this.isUpdate) this.updateCustomer();
  }

  getCustomerById() {
    this.customersService
      .getCustomerById(this.customerId)
      .subscribe((data: any) => {
        this.customerData = data;
      });
  }
  updateCustomer() {
    if (this.isUpdate) {
      this.customersService
        .getCustomerById(this.customerId)
        .subscribe((data) => {
          this.customersService.apiModelToComponentModelPathch(this.form, data);
        });
    }
  }
}
