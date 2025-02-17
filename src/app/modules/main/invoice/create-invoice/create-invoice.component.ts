import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { main_routes_paths } from '../../main.routes';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-create-invoice',
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
    DatePicker,
    ToastModule,
    PanelModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './create-invoice.component.html',
})
export default class CreateInvoiceComponent {
  route: MenuItem[] | undefined;
  mainPaths = main_routes_paths;
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  items: MenuItem[] = [];

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    total_invoice: [null, [Validators.required]],
    discount_invoice: [null, [Validators.required]],
    net_invoice: [null, [Validators.required]],
    invoice_number: [null, [Validators.required]],
    supplierName: [null, [Validators.required]],
    boxQnt: [null, [Validators.required]],
    totalCBM: [null, [Validators.required]],
    totalWeight: [null, [Validators.required]],
    firstBatchNumber: [null, [Validators.required]],
    firstBatchDate: [null, [Validators.required]],
    secondBatchNumber: [null, [Validators.required]],
    secondBatchDate: [null, [Validators.required]],
    thirdBatchNumber: [null, [Validators.required]],
    thirdBatchDate: [null, [Validators.required]],

    items: this.formBuilder.array([this.generateItemLine()], []),
  });

  generateItemLine(): FormGroup {
    return this.formBuilder.group({
      container: [null],
      item: [null],
      desorption: [null],
      boxQnt: [null],
      qunNumber: [null],
      price: [null],
      total_price: [],
      CBM_store: [null],
      CBM_height: [null],
      CBM_width: [null],
      CBM_length: [null],
      total_CBM: [null],
      weight: [null],
      total_weight: [null],
    });
  }

  get itemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.itemsFormArray.push(this.generateItemLine());
  }

  deleteFormLine(index: number) {
    if (this.itemsFormArray.length > 1) this.itemsFormArray.removeAt(index);
    else this.showTopLeft('ONE_PROD_MIN');
  }

  showTopLeft(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Error message',
      detail: message,
      key: 'tl',
      life: 3000,
    });
  }

  submit(form: FormGroup) {
    console.log(form.value);
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit() {
    this.route = [
      {
        icon: 'pi pi-receipt',
        route: this.mainPaths.data,
        queryParams: { type: 'invoices' },
      },
      { label: 'invoices', route: this.mainPaths.invoices },
    ];
  }
}
