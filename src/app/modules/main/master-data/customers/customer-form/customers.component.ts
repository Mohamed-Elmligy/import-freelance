import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { main_routes_paths } from '../../../main.routes';
import { TextareaModule } from 'primeng/textarea';
import { CustomersService } from '../customers.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

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
    PageHeaderComponent,
  ],
  templateUrl: './customers.component.html',
  styles: ``,
})
export default class CustomersComponent implements OnInit {
  route: MenuItem[] = [];
  mainPaths = main_routes_paths;

  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private customersService = inject(CustomersService);

  customerData = {
    id: 0,
    name: '',
    email: '',
    code: 0,
    commession: '',
    description: '',
  };

  isUpdate = false;
  customerId: number | null = null;

  form: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    customerCode: [null, [Validators.required]],
    commission: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  ngOnInit() {
    this.route = [
      {
        icon: 'pi pi-users',
        route: this.mainPaths.customersList,
        queryParams: { type: 'customers' },
      },
      { label: 'customers', route: this.mainPaths.customers },
    ];

    this.activatedRoute.queryParams.subscribe((params) => {
      this.isUpdate = params['edit'] === 'true';
      this.customerId = params['customerId'] ? +params['customerId'] : null;

      if (this.customerId) {
        this.loadCustomerData();
      }
    });
  }

  loadCustomerData() {
    this.customersService
      .getCustomerById(this.customerId?.toString()!)
      .subscribe((data: any) => {
        this.customerData = data;
        if (this.isUpdate) {
          this.customersService.apiModelToComponentModelPathch(this.form, data);
        }
      });
  }

  submit(form: FormGroup) {
    if (form.valid) {
      if (this.isUpdate) {
        this.customersService.updateCustomer(
          form,
          this.customerId?.toString()!
        );
      } else {
        this.customersService.createCustomer(form);
      }
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }
}
