import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ReportsService } from '../reports.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { reportsApis } from '../reports.apis';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { LanguagesService } from '../../../shared/services/languages.service';

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
  ],
  templateUrl: './download-reports.component.html',
})
export default class DownloadReportsComponent {
  languageService = inject(LanguagesService);
  reportService = inject(ReportsService);
  showMessageService = inject(ShowMessageService);

  reportsTypes: ReportType[] | undefined;
  selectedReport = signal<ReportType | undefined>(undefined);

  selectedCustomer: CustomerList | undefined;

  selectedSupplier: SupplierList | undefined;

  selectedInvoice: InvoiceList | undefined;

  reportsTypesTranslation = {
    en: {
      containerDetails: 'Container Details',
      supplierReport: 'Supplier Report',
      customerFinancialReport: 'Customer Financial Report',
    },
    ar: {
      containerDetails: 'شراء الحاوية',
      supplierReport: 'تقرير المورد',
      customerFinancialReport: 'تقرير مالى للعميل',
    },
  };
  ngOnInit(): void {
    this.reportsTypes = [
      {
        name: this.reportsTypesTranslation[
          this.languageService.layoutDir() === 'rtl' ? 'ar' : 'en'
        ]['containerDetails'],
        code: 'invoiceDetails',
      },
      {
        name: this.reportsTypesTranslation[
          this.languageService.layoutDir() === 'rtl' ? 'ar' : 'en'
        ]['supplierReport'],
        code: 'supplierReport',
      },
      {
        name: this.reportsTypesTranslation[
          this.languageService.layoutDir() === 'rtl' ? 'ar' : 'en'
        ]['customerFinancialReport'],
        code: 'customerFinancialReport',
      },
    ];
  }

  onReportTypeChange(reportType: ReportType) {
    this.selectedReport.set(reportType);

    switch (reportType.code) {
      case 'invoiceDetails':
        this.reportService.getListOfCustomers();
        this.reportService.getListOfInvoices();
        break;
      case 'supplierReport':
        this.reportService.getListOfSuppliers();
        break;
      case 'customerFinancialReport':
        this.reportService.getListOfCustomers();
        break;
    }
  }

  downloadReport() {
    if (this.selectedReport()?.code == 'invoiceDetails') {
      if (!this.selectedCustomer && !this.selectedInvoice) {
        this.showMessageService.showMessage(
          'error',
          'Unvalid Paremeters',
          'Please select customer or invoice'
        );
        return;
      }
      this.reportService.downloadReport(reportsApis['invoiceDetails'], {
        customer_id: this.selectedCustomer,
        invoice_number: this.selectedInvoice,
      });
    }

    if (this.selectedReport()?.code == 'supplierReport') {
      if (!this.selectedSupplier) {
        this.showMessageService.showMessage(
          'error',
          'Unvalid Paremeters',
          'Please select supplier'
        );
        return;
      }
      this.reportService.downloadReport(reportsApis['supplierReport'], {
        supplier_code: this.selectedSupplier,
      });
    }

    if (this.selectedReport()?.code == 'customerFinancialReport') {
      if (!this.selectedCustomer) {
        this.showMessageService.showMessage(
          'error',
          'Unvalid Paremeters',
          'Please select customer'
        );
        return;
      }
      this.reportService.downloadReport(reportsApis['customerFinancialReport'], {
        customer_id: this.selectedCustomer,
      });
    }

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
