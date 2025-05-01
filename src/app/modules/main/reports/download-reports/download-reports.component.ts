import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ReportsService, reportVewType } from '../reports.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { reportsApis } from '../reports.apis';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { LanguagesService } from '../../../shared/services/languages.service';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-download-reports',
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    Select,
    FloatLabel,
    FormsModule,
    PageHeaderComponent,
    TranslateModule,
    Dialog,
    TableModule,
    CommonModule,
    TooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './download-reports.component.html',
})
export default class DownloadReportsComponent implements OnInit {
  languageService = inject(LanguagesService);
  reportService = inject(ReportsService);
  showMessageService = inject(ShowMessageService);
  private formBuilder: FormBuilder;
  private route: ActivatedRoute;

  constructor(
    formBuilder: FormBuilder,
    route: ActivatedRoute
  ) {
    this.formBuilder = formBuilder;
    this.route = route;
    this.filterForm = this.formBuilder.group({
      customer_id: [null],
      supplier_code: [null],
      selectedInvoice: [null],
      container_number: [null],
    });
    this.ngOnInit();
  }

  reportsTypes: ReportType[] | undefined;
  selectedReport = signal<ReportType | undefined>(undefined);

  reportView: reportVewType = {
    results: [],
    totals: {
      box_count: 0,
      item_in_box: 0,
      item_price: 0,
      total_cbm: 0,
      total_weight: 0,
      total_price: 0,
    },
  };

  reportColumns: { [K in ReportType['code']]: string[] } = {
    invoiceDetails: [
      'container_sequence',
      'item_code',
      'item_description',
      'box_count',
      'item_in_box',
      'store_cbm',
      'item_price',
      'total_price',
      'unit_price',
      'amount_price',
      'length',
      'width',
      'height',
      'total_cbm',
      'total_weight',
    ],
    supplierReport: [
      "invoice_number",
      "customer__name",
      "net_amount",
      "first_payment_amount",
      "first_payment_date",
      "second_payment_amount",
      "second_payment_date",
      "third_payment_amount",
      "third_payment_date",
      "balance",
    ],
    customerFinancialReport: [
      "container",
      "total_amount",
      "total_commission",
      "total_expense",
      "total_line",
    ],
    totalPaymentsReport: [
      "customer_code",
      "customer_name",
      "date",
      "amount",
      "description",
    ],
    totalExpensesReport: [
      "customer_code",
      "customer_name",
      "date",
      "amount",
      "description",
      "container_number",
    ],
    supplierFinancialReport: [
      "invoice_number",
      "customer_name",
      "net_amount",
      "first_payment_amount",
      "first_payment_date",
      "second_payment_amount",
      "second_payment_date",
      "third_payment_amount",
      "third_payment_date",
      "balance",
    ],
  };

  filterForm: any;

  visible: boolean = false;

  reportsTypesTranslation = {
    en: {
      containerDetails: 'Container Details',
      supplierReport: 'Supplier Report',
      customerFinancialReport: 'Customer Financial Report',
      totalPaymentsReport: 'Total Payments Report',
      totalExpensesReport: 'Total Expenses Report',
      supplierFinancialReport: 'Supplier Financial Report',
    },
    ar: {
      containerDetails: 'تقرير شراء الحاوية',
      supplierReport: 'تقرير مالي للمورد',
      customerFinancialReport: 'تقرير مالي للعميل',
      totalPaymentsReport: 'تقرير إجمالي المدفوعات',
      totalExpensesReport: 'تقرير إجمالي المصروفات',
      supplierFinancialReport: 'تقرير مالي للمورد',
    },
  };
  ngOnInit(): void {
    const translation =
      this.reportsTypesTranslation[
      this.languageService.layoutDir() === 'rtl' ? 'ar' : 'en'
      ];

    this.reportsTypes = [
      { name: translation.containerDetails, code: 'invoiceDetails' },
      { name: translation.supplierReport, code: 'supplierReport' },
      {
        name: translation.customerFinancialReport,
        code: 'customerFinancialReport',
      },
      { name: translation.totalPaymentsReport, code: 'totalPaymentsReport' },
      { name: translation.totalExpensesReport, code: 'totalExpensesReport' },
      { name: translation.supplierFinancialReport, code: 'supplierFinancialReport' },
    ];

    // Get the report type from the route data
    const reportType = this.route.snapshot.data['reportType'];
    if (reportType) {
      const selectedReport = this.reportsTypes.find(r => r.code === reportType);
      if (selectedReport) {
        this.selectedReport.set(selectedReport);
        this.onReportTypeChange(selectedReport);
      }
    }
  }

  generateReport(viewReport: boolean = false) {
    const selectedReport = this.selectedReport();
    if (!selectedReport) {
      return;
    }
    const type: keyof typeof reportsApis =
      selectedReport.code as keyof typeof reportsApis;
    if (viewReport) this.viewReportApi('get_' + type);
  }

  viewReportApi(type: any) {
    let notEmpityKey = Object.values(this.filterForm.value).find(
      (value) => value != null || value != undefined
    );

    if (notEmpityKey) {
      this.reportService
        .reportApi(type, this.filterForm.value)
        .subscribe((res: reportVewType) => {
          this.reportView = res;
          this.visible = true;
        });
    } else {
      this.visible = false;
      this.showMessageService.showMessage(
        'error',
        'Unvalid Paremeters',
        'Please select one atleast Paremeter'
      );
      return;
    }
  }

  onReportTypeChange(selectedReport: ReportType) {
    this.selectedReport.set(selectedReport);

    switch (selectedReport.code) {
      case 'invoiceDetails':
        this.reportService.getListOfCustomers();
        this.reportService.getListOfInvoices();
        break;

      case 'supplierReport':
      case 'supplierFinancialReport':
        this.reportService.getListOfSuppliers();
        this.reportService.getListOfCustomers();
        break;

      case 'customerFinancialReport':
      case 'totalPaymentsReport':
      case 'totalExpensesReport':
        this.reportService.getListOfCustomers();
        break;
    }
    this.filterForm.reset();
  }

  downloadReport(type: 'pdf' | 'excel') {
    const selectedReport = this.selectedReport();
    const customer_id = this.filterForm.get('customer_id')?.value;
    const supplier_code = this.filterForm.get('supplier_code')?.value;
    const container_number = this.filterForm.get('container_number')?.value;

    if (!selectedReport) {
      return;
    }

    const reportApi =
      type == 'excel'
        ? reportsApis[selectedReport.code as keyof typeof reportsApis]
        : reportsApis[
        ('pdf_' + selectedReport.code) as keyof typeof reportsApis
        ];
    if (!reportApi) {
      return;
    }

    const params: any = {};

    switch (selectedReport.code) {
      case 'invoiceDetails':
        if (!customer_id && !container_number) {
          this.showMessageService.showMessage(
            'error',
            'Unvalid Paremeters',
            'Please select customer or container number'
          );
          return;
        }

        if (customer_id) {
          params.customer_id = customer_id;
        }

        if (container_number) {
          params.container_number = container_number;
        }

        break;

      case 'supplierReport':
        if (!supplier_code) {
          this.showMessageService.showMessage(
            'error',
            'Unvalid Paremeters',
            'Please select supplier'
          );
          return;
        }

        params.supplier_code = supplier_code;
        break;

      case 'supplierFinancialReport':
        // Both fields are optional, so no validation needed
        if (supplier_code) {
          params.supplier_id = supplier_code;
        }
        if (customer_id) {
          params.customer_id = customer_id;
        }
        break;

      case 'customerFinancialReport':
        if (!customer_id) {
          this.showMessageService.showMessage(
            'error',
            'Unvalid Paremeters',
            'Please select customer'
          );
          return;
        }

        params.customer_id = customer_id;
        break;

      case 'totalPaymentsReport':
        params.customer_id = customer_id;
        break;
      case 'totalExpensesReport':
        params.customer_id = customer_id;
        break;
    }
    const selectedFileName = this.reportsTypes?.find(
      (report) => report.code === selectedReport.code
    )?.name;
    if (type == 'excel') {
      this.reportService.downloadReport(
        'excel',
        reportApi,
        params,
        selectedFileName
      );
    } else if (type == 'pdf') {
      this.reportService.downloadReport(
        'pdf',
        reportApi,
        params,
        selectedFileName
      );
    }
  }

  resetAll() {
    // Only reset form values without clearing the selected report type
    this.filterForm.patchValue({
      customer_id: null,
      supplier_code: null,
      selectedInvoice: null,
      container_number: null,
    });
  }
}

export interface ReportType {
  name: string;
  code: 'invoiceDetails' | 'supplierReport' | 'customerFinancialReport' | 'totalPaymentsReport' | 'totalExpensesReport' | 'supplierFinancialReport';
}

export interface CustomerList {
  id: number;
  name: string;
}

export interface SupplierList {
  id: number;
  name: string;
}

export interface InvoiceList {
  id: number;
  invoice_name: string;
}
