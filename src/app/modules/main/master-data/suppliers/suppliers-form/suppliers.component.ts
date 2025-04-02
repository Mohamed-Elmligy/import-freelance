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
import { TextareaModule } from 'primeng/textarea';
import { main_routes_paths } from '../../../main.routes';
import { SuppliersService } from '../suppliers.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-suppliers',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    PageHeaderComponent,
  ],
  templateUrl: './suppliers.component.html',
  styles: ``,
})
export default class SuppliersComponent {
  route: MenuItem[] = [];
  mainPaths = main_routes_paths;

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private supplierService = inject(SuppliersService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  supplierId = this.activatedRoute.snapshot.queryParams['supplierId'];

  supplierData: {
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

  form: FormGroup = this.formBuilder.group({
    supplierName: [null, [Validators.required]],
    email: [null, []],
    // supplierCode: [null, [Validators.required]],
    storeNumber: [null, [Validators.required]],
    description: [null, []],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      // const formData = form.getRawValue();
      if (this.isUpdate) {
        this.supplierService.updateSupplier(form, this.supplierId!);
      } else {
        this.supplierService.createSupplier(form);
      }
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit() {
    this.supplierService.getSupplierSequence().subscribe((data: any) => {
      this.supplierData.code = data.next_sequence;
    });
    this.route = [
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
        this.supplierData = data;
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
