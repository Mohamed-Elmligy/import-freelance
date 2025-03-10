import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { InvoiceService } from '../invoice.service';
import { LookupsService } from '../../../shared/services/lookups.service';
import { map } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

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
    SelectModule,
    CardModule,
    TableModule,
  ],
  providers: [MessageService],
  templateUrl: './create-invoice.component.html',
})
export default class CreateInvoiceComponent {
  items: MenuItem[] = [];
  route: MenuItem[] | undefined;
  mainPaths = main_routes_paths;

  listOfCustomers = signal([]);
  listOfSuppliers = signal([]);
  listOfItems = signal([]);

  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);
  private lookupService = inject(LookupsService);
  private invoiceService = inject(InvoiceService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  invoiceId = this.activatedRoute.snapshot.queryParams['invoiceId'];

  invoiceData: InvoiceUpdateData = {} as InvoiceUpdateData;

  tableHeader = [
    'contatierSequance',
    'item_code',
    'description',
    'boxQnt',
    'item',
    'price',
    'totalPrice',
    'store_cbm',
    'height',
    'width',
    'length',
    'totalCBM',
    'weight',
    'totalWeight',
  ];

  protected form = this.formBuilder.group({
    customer: [null],
    supplier: [null],
    item_category: [null],
    total_amount: [null],
    discount_amount: [null],
    net_invoice: [null],
    invoice_number: [null],
    total_boxes: [null],
    total_cbm: [null],
    totalCBM: [null],
    total_weight: [null],
    invoice_date: [null],
    first_payment_amount: [null],
    first_payment_date: [null],
    second_payment_amount: [null],
    second_payment_date: [null],
    third_payment_amount: [null],
    third_payment_date: [null],
    fourth_payment_amount: [null],
    fourth_payment_date: [null],
    invoice_lines: this.formBuilder.array([], []),
  });

  generateItemLine(): FormGroup {
    return this.formBuilder.group({
      container_sequence: [null],
      item_code: [null],
      item_description: [null],
      box_count: [null],
      item_in_box: [null],
      item_price: [null],
      total_price: [],
      store_cbm: [null],
      height: [null],
      width: [null],
      length: [null],
      total_CBM: [null],
      weight: [null],
      total_weight: [null],
    });
  }

  get invoice_linesFormArray(): FormArray {
    return this.form.get('invoice_lines') as FormArray;
  }

  addItem() {
    this.invoice_linesFormArray.push(this.generateItemLine());
  }

  deleteFormLine(index: number) {
    if (this.invoice_linesFormArray.length > 1)
      this.invoice_linesFormArray.removeAt(index);
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
    console.log(form.controls);

    if (form.valid) {
      if (!this.isUpdate) this.invoiceService.createInvoice(form);
      else this.invoiceService.updateInvoice(form, this.invoiceId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit() {
    this.lookupService.getListOfLookups('customers').subscribe((data: any) => {
      this.listOfCustomers.set(data);
      this.invoiceService.listOfCustomers.set(data);
    });

    this.lookupService.getListOfLookups('suppliers').subscribe((data: any) => {
      this.listOfSuppliers.set(data);
      this.invoiceService.listOfSuppliers.set(data);
    });

    this.lookupService
      .getListOfLookups('items-categories')
      .subscribe((data: any) => {
        this.listOfItems.set(data);
        this.invoiceService.listOfItems.set(data);
      });

    this.route = [
      {
        icon: 'pi pi-receipt',
        route: this.mainPaths.invoicesList,
        queryParams: { type: 'invoices' },
      },
      { label: 'invoices', route: this.mainPaths.invoices },
    ];

    if (this.invoiceId && !this.isUpdate) this.getInvoiceById();
    if (this.invoiceId && this.isUpdate) this.getForUpdateInvoice();
  }

  getInvoiceById() {
    this.invoiceService
      .getInvoiceById(this.invoiceId)
      .subscribe((data: any) => {
        this.invoiceData = data;
      });
  }
  getForUpdateInvoice() {
    if (this.isUpdate) {
      this.invoiceService
        .getInvoiceByIdForUpdate(this.invoiceId)
        .pipe(
          map((data: any) => {
            const invoiceLines = data.invoice_lines;
            this.invoice_linesFormArray.clear();
            invoiceLines.forEach((line: any) => {
              const lineGroup = this.generateItemLine();
              lineGroup.patchValue(line);
              this.invoice_linesFormArray.push(lineGroup);
            });
            return this.invoiceService.apiModelToComponentModelPathch(
              this.form,
              data
            );
          })
        )
        .subscribe((data: any) => {
          this.form.patchValue(data);
        });
    }
  }
}

export interface InvoiceLine {
  container_sequence: number;
  item_code: string;
  item_description: string;
  box_count: number;
  item_in_box: number;
  item_price: string;
  store_cbm: string;
  width: string;
  length: string;
  height: string;
  weight: string;
}

export interface InvoiceUpdateData {
  company: number;
  item_category: number;
  customer: number;
  supplier: number;
  invoice_number: string;
  invoice_date: string;
  total_amount: string;
  discount_amount: string;
  net_amount: string;
  invoice_lines: InvoiceLine[];
}
