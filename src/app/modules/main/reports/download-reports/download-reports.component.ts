import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './download-reports.component.html',
})
export default class DownloadReportsComponent {
  languageService = inject(LanguagesService);
  reportService = inject(ReportsService);
  showMessageService = inject(ShowMessageService);

  reportsTypes: ReportType[] | undefined;
  selectedReport = signal<ReportType | undefined>(undefined);

  reportView: reportVewType = {
    results: [],
    totals: {
      box_count: 0,
      item_in_box: 0,
      item_price: 0,
      total_price: 0,
      total_cbm: 0,
      total_weight: 0,
    },
  };

  selectedCustomer: CustomerList | undefined;

  selectedSupplier: SupplierList | undefined;

  selectedInvoice: InvoiceList | undefined;

  containerSequence: string | undefined;

  visible: boolean = false;

  reportsTypesTranslation = {
    en: {
      containerDetails: 'Container Details',
      supplierReport: 'Supplier Report',
      customerFinancialReport: 'Customer Financial Report',
      totalPaymentsReport: 'Total Payments Report',
      totalExpensesReport: 'Total Expenses Report',
    },
    ar: {
      containerDetails: 'تقرير شراء الحاوية',
      supplierReport: 'تقرير مالي للمورد',
      customerFinancialReport: 'تقرير مالى للعميل',
      totalPaymentsReport: 'تقرير الدفعات',
      totalExpensesReport: 'تقرير المصاريف',
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
    ];
  }

  generateReport() {
    this.reportService
      .getInvoiceDetails({
        container_number: this.containerSequence,
        customer_id: this.selectedCustomer,
      })
      .subscribe((res: reportVewType) => {
        this.reportView = res;
        this.visible = true;
      });
  }

  onReportTypeChange(selectedReport: ReportType) {
    this.selectedReport.set(selectedReport);

    switch (selectedReport.code) {
      case 'invoiceDetails':
        this.reportService.getListOfCustomers();
        this.reportService.getListOfInvoices();
        break;

      case 'supplierReport':
        this.reportService.getListOfSuppliers();
        break;

      case 'customerFinancialReport':
      case 'totalPaymentsReport':
      case 'totalExpensesReport':
        this.reportService.getListOfCustomers();
        break;
    }
  }

  downloadReport() {
    const selectedReport = this.selectedReport();
    const selectedCustomer = this.selectedCustomer;
    const selectedSupplier = this.selectedSupplier;
    const containerSequence = this.containerSequence;

    if (!selectedReport) {
      return;
    }

    const reportApi =
      reportsApis[selectedReport.code as keyof typeof reportsApis];

    if (!reportApi) {
      return;
    }

    const params: any = {};

    switch (selectedReport.code) {
      case 'invoiceDetails':
        if (!selectedCustomer && !containerSequence) {
          this.showMessageService.showMessage(
            'error',
            'Unvalid Paremeters',
            'Please select customer or invoice'
          );
          return;
        }

        if (selectedCustomer) {
          params.customer_id = selectedCustomer;
        }

        if (containerSequence) {
          params.container_number = containerSequence;
        }

        break;

      case 'supplierReport':
        if (!selectedSupplier) {
          this.showMessageService.showMessage(
            'error',
            'Unvalid Paremeters',
            'Please select supplier'
          );
          return;
        }

        params.supplier_code = selectedSupplier;
        break;

      case 'customerFinancialReport':
        if (!selectedCustomer) {
          this.showMessageService.showMessage(
            'error',
            'Unvalid Paremeters',
            'Please select customer'
          );
          return;
        }

        params.customer_id = selectedCustomer;
        break;

      case 'totalPaymentsReport':
        params.customer_id = selectedCustomer;
        break;
      case 'totalExpensesReport':
        params.customer_id = selectedCustomer;
        break;
    }

    this.reportService.downloadReport(reportApi, params);
  }

  resetAll() {
    this.selectedReport.set(undefined);
    this.selectedCustomer = undefined;
    this.selectedSupplier = undefined;
    this.selectedInvoice = undefined;
  }
}

export interface ReportType {
  name: string;
  code: string;
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
