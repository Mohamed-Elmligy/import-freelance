import { Component, HostListener, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
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
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-invoice',
  imports: [
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    DatePicker,
    ToastModule,
    PanelModule,
    AvatarModule,
    MenuModule,
    TooltipModule,
    SelectModule,
    CardModule,
    TableModule,
    PageHeaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './create-invoice.component.html',
})
export default class CreateInvoiceComponent {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default Enter key behavior
      const formElements = Array.from(
        document.querySelectorAll(
          'input, select, textarea, button'
        ) as NodeListOf<HTMLElement>
      );
      const currentIndex = formElements.indexOf(
        document.activeElement as HTMLElement
      );
      if (currentIndex > -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus(); // Focus on the next element
      }
    }
  }
  route: MenuItem[] = [];
  mainPaths = main_routes_paths;

  listOfCustomers = signal([]);
  listOfSuppliers = signal([]);
  listOfItems = signal([]);

  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmService = inject(ConfirmSaveDeleteService);
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
    customer: [null, Validators.required],
    supplier: [null, Validators.required],
    item_category: [null],
    total_amount: [0],
    discount_amount: [null],
    net_amount: [0],
    invoice_number: [null],
    total_boxes: [0],
    total_cbm: [0],
    total_store_cbm: [0],
    total_weight: [0],
    invoice_date: [new Date()], // Set default to current date
    first_payment_amount: [0],
    first_payment_date: [null],
    second_payment_amount: [0],
    second_payment_date: [null],
    third_payment_amount: [0],
    third_payment_date: [null],
    fourth_payment_amount: [0],
    fourth_payment_date: [null],
    invoice_lines: this.formBuilder.array([], []),
  });

  generateItemLine(): FormGroup {
    return this.formBuilder.group({
      container_sequence: [],
      item_code: [null],
      item_description: [null],
      box_count: [],
      item_in_box: [],
      item_price: [],
      store_cbm: [],
      height: [],
      width: [],
      length: [],
      weight: [],
      id: [null],
    });
  }

  get invoice_linesFormArray(): FormArray {
    return this.form.get('invoice_lines') as FormArray;
  }

  addItem() {
    this.invoice_linesFormArray.push(this.generateItemLine());
  }

  deleteFormLineInCreate(index: number) {
    if (this.invoice_linesFormArray.length > 1)
      this.invoice_linesFormArray.removeAt(index);
    else this.showTopLeft('ONE_PROD_MIN');
  }

  deleteFormLineInUpdate(index: number) {
    if (this.invoice_linesFormArray.length > 1) {
      const lineId = this.invoice_linesFormArray.at(index).get('id')?.value;
      if (lineId) {
        this.invoiceService.deleteInvoiceLine(lineId).subscribe(() => {
          this.invoice_linesFormArray.removeAt(index);
        });
      } else {
        this.invoice_linesFormArray.removeAt(index);
      }
    } else this.showTopLeft('ONE PROD MIN');
  }

  deleteFormLine(index: number) {
    this.confirmService.confirmDelete(
      'Are You Sure You want to Delete this Line?',
      () => this.deleteFormLineHandler(index)
    );
  }

  deleteFormLineHandler(index: number) {
    if (this.isUpdate) this.deleteFormLineInUpdate(index);
    else this.deleteFormLineInCreate(index);
  }

  showTopLeft(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Error message',
      detail: message,
      key: 'tl',
      life: 8000,
    });
  }

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.invoiceService.createInvoice(form);
      else this.invoiceService.updateInvoice(form, this.invoiceId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit(): void {
    this.initializeLookups();

    this.route = [
      {
        icon: 'pi pi-receipt',
        route: this.mainPaths.invoicesList,
        queryParams: { type: 'invoices' },
      },
      { label: 'invoices', route: this.mainPaths.invoices },
    ];

    // Set today's date for new invoices
    if (!this.invoiceId && !this.isUpdate) {
      this.form.patchValue({
        invoice_date: new Date(),
      });
    }

    if (this.invoiceId) {
      this.isUpdate ? this.getForUpdateInvoice() : this.getInvoiceById();
    }

    // Subscribe to changes in the form array to calculate totals
    this.invoice_linesFormArray.valueChanges.subscribe(() => {
      this.calculateTotalBoxes();
      this.calculateTotalWeight();
      this.calculateTotalAmount();
      this.calculateNetAmount();
      this.calculateTotalCBM();
      this.calculateTotalStoreCBM();
    });

    // Subscribe to changes in discount_amount to recalculate net_amount
    this.form.get('discount_amount')?.valueChanges.subscribe(() => {
      this.calculateNetAmount();
    });
  }

  private initializeLookups(): void {
    this.lookupService
      .getListOfLookups('customers')
      .pipe(
        map((data: any) => {
          this.listOfCustomers.set(data);
          this.invoiceService.listOfCustomers.set(data);
          if (!this.isUpdate) {
            for (let i = 0; i < 3; i++) {
              this.addItem();
            }
          }
        })
      )
      .subscribe();

    this.lookupService
      .getListOfLookups('suppliers')
      .pipe(
        map((data: any) => {
          this.listOfSuppliers.set(data);
          this.invoiceService.listOfSuppliers.set(data);
        })
      )
      .subscribe();

    this.lookupService
      .getListOfLookups('items-categories')
      .pipe(
        map((data: any) => {
          this.listOfItems.set(data);
          this.invoiceService.listOfItems.set(data);
        })
      )
      .subscribe();
  }

  getInvoiceById() {
    this.invoiceService
      .getInvoiceById(this.invoiceId)
      .pipe(
        map((data: any) => {
          this.invoiceData = data;
        })
      )
      .subscribe();
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
            return this.invoiceService.apiModelToComponentModelPatch(
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

  calculateTotalBoxes(): void {
    const totalBoxes = this.invoice_linesFormArray.controls.reduce(
      (sum, line) => {
        const boxCount = parseFloat(line.get('box_count')?.value) || 0; // Parse as number
        return sum + boxCount;
      },
      0
    );
    this.form.get('total_boxes')?.setValue(totalBoxes, { emitEvent: false });
  }

  calculateTotalWeight(): void {
    const totalWeight = this.invoice_linesFormArray.controls.reduce(
      (sum, line) => {
        const weight = parseFloat(line.get('weight')?.value) || 0;
        const boxCount = parseFloat(line.get('box_count')?.value) || 0;
        return sum + weight * boxCount;
      },
      0
    );
    this.form.get('total_weight')?.setValue(totalWeight, { emitEvent: false });
  }

  calculateTotalAmount(): void {
    const totalAmount = Number(this.invoice_linesFormArray.controls.reduce(
      (sum, line) => {
        const itemPrice = parseFloat(line.get('item_price')?.value) || 0;
        const itemInBox = parseFloat(line.get('item_in_box')?.value) || 0;
        const boxCount = parseFloat(line.get('box_count')?.value) || 0;
        return sum + itemPrice * itemInBox * boxCount;
      },
      0
    ).toFixed(3));
    this.form.get('total_amount')?.setValue(totalAmount, { emitEvent: false });
  }

  calculateNetAmount(): void {
    const totalAmount =
      parseFloat(String(this.form.get('total_amount')?.value)) || 0;
    const discountAmount =
      parseFloat(String(this.form.get('discount_amount')?.value)) || 0;
    const netAmount = Number((totalAmount - discountAmount).toFixed(3));
    this.form.get('net_amount')?.setValue(netAmount, { emitEvent: false });
  }

  calculateTotalCBM(): void {
    const totalCBM = this.invoice_linesFormArray.controls.reduce(
      (sum, line) => {
        const height = parseFloat(line.get('height')?.value) || 0;
        const width = parseFloat(line.get('width')?.value) || 0;
        const length = parseFloat(line.get('length')?.value) || 0;
        const boxCount = parseFloat(line.get('box_count')?.value) || 0;
        return sum + (height * width * length * boxCount) / 1000000;
      },
      0
    );
    this.form.get('total_cbm')?.setValue(totalCBM, { emitEvent: false });
  }

  calculateTotalStoreCBM(): void {
    const totalStoreCBM = this.invoice_linesFormArray.controls.reduce(
      (total, line) => {
        const boxCount = parseFloat(line.get('box_count')?.value) || 0;
        const storeCBM = parseFloat(line.get('store_cbm')?.value) || 0;
        return total + boxCount * storeCBM;
      },
      0
    );
    this.form
      .get('total_store_cbm')
      ?.setValue(totalStoreCBM, { emitEvent: false });
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
  width: number;
  length: number;
  height: number;
  weight: string;
}

export interface InvoiceUpdateData {
  company: number;
  item_category: string;
  customer: number;
  supplier: number;
  invoice_number: string;
  invoice_date: string;
  total_amount: string;
  discount_amount: string;
  net_amount: string;
  first_payment_amount: string;
  first_payment_date: string;
  second_payment_amount: string;
  second_payment_date: string;
  third_payment_amount: string;
  third_payment_date: string;
  fourth_payment_amount: string;
  fourth_payment_date: string;
  total_boxes: string;
  total_cbm: string;
  total_store_cbm: string;
  total_weight: string;
  invoice_lines: InvoiceLine[];
}
