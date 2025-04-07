import { Component, HostListener, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
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
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-create-invoice',
  imports: [
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
    customer: [null],
    supplier: [null],
    item_category: [null],
    total_amount: [0.0],
    discount_amount: [0.0],
    net_amount: [0.0],
    invoice_number: [null],
    total_boxes: [0.0],
    total_cbm: [0.0],
    totalCBM: [0.0],
    total_weight: [0.0],
    invoice_date: [new Date()], // Set default to current date
    first_payment_amount: [0.0],
    first_payment_date: [null],
    second_payment_amount: [0.0],
    second_payment_date: [null],
    third_payment_amount: [0.0],
    third_payment_date: [null],
    fourth_payment_amount: [0.0],
    fourth_payment_date: [null],
    invoice_lines: this.formBuilder.array([], []),
  });

  generateItemLine(): FormGroup {
    return this.formBuilder.group({
      container_sequence: [0],
      item_code: [null],
      item_description: [null],
      box_count: [0],
      item_in_box: [0],
      item_price: [0.0],
      store_cbm: [0.0],
      height: [0.0],
      width: [0.0],
      length: [0.0],
      weight: [0.0],
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
  total_weight: string;
  invoice_lines: InvoiceLine[];
}
