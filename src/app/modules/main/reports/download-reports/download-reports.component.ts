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
  reportService = inject(ReportsService);
  showMessageService = inject(ShowMessageService);

  reportsTypes: ReportType[] | undefined;
  selectedReport = signal<ReportType | undefined>(undefined);

  selectedCustomer: CustomerList | undefined;

  selectedSupplier: SupplierList | undefined;

  selectedInvoice: InvoiceList | undefined;

  ngOnInit() {
    this.reportsTypes = [
      { name: 'Invoice Details', code: 'invoiceDetails' },
      { name: 'Supplier Report', code: 'supplierReport' },
    ];
  }

  getSelectedReport(event: any) {
    this.selectedReport.set(event.value);
    if (this.selectedReport()?.code == 'invoiceDetails') {
      this.reportService.getListOfCustomers();
      this.reportService.getListOfInvoices();
    }

    if (this.selectedReport()?.code == 'supplierReport') {
      this.reportService.getListOfSuppliers();
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
