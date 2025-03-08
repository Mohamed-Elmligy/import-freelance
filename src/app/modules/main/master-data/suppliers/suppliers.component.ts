import { CommonModule } from '@angular/common';
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
import { SuppliersService } from './suppliers.service';
import { LookupsService } from '../../../shared/services/lookups.service';

@Component({
  selector: 'app-suppliers',
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
  templateUrl: './suppliers.component.html',
  styles: ``,
})
export default class SuppliersComponent {
  items: MenuItem[] | undefined;
  mainPaths = main_routes_paths;

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private supplierService = inject(SuppliersService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  supplierId = this.activatedRoute.snapshot.queryParams['supplierId'];

  protected form = this.formBuilder.group({
    supplierName: [null, [Validators.required]],
    email: [null, [Validators.required]],
    customerCode: [null, [Validators.required]],
    storeNumber: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  suppliertData: {
    name: string;
    email: string;
    code: string;
    store_number: string;
    description: string;
  } = {
    name: '',
    email: '',
    code: '',
    store_number: '',
    description: '',
  };

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.supplierService.createSupplier(form);
      else this.supplierService.updateSupplier(form, this.supplierId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit() {
    this.items = [
      {
        icon: 'pi  pi-truck',
        route: this.mainPaths.suppliersList,
        queryParams: { type: 'suppliers' },
      },
      { label: 'suppliers', route: this.mainPaths.suppliers },
    ];

    if (this.supplierId && !this.isUpdate) this.getSupplierById();
    if (this.supplierId && this.isUpdate) this.updateSupplier();
  }

  getSupplierById() {
    this.supplierService
      .getSupplierById(this.supplierId)
      .subscribe((data: any) => {
        this.suppliertData = data;
      });
  }

  updateSupplier() {
    if (this.isUpdate) {
      this.supplierService
        .getSupplierById(this.supplierId)
        .subscribe((data) => {
          this.supplierService.apiModelToComponentModel(this.form, data);
        });
    }
  }
}
