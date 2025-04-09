import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { LookupsService } from '../../shared/services/lookups.service';
import {
  CustomerList,
  InvoiceList,
  SupplierList,
} from './download-reports/download-reports.component';
import { reportsApis } from './reports.apis';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private lookupService = inject(LookupsService);
  private api = inject(ApiService);
  listOfCustomers = signal<CustomerList[] | undefined>([]);
  listOfSuppliers = signal<SupplierList[] | undefined>([]);
  listOfInvoices = signal<InvoiceList[] | undefined>([]);

  getListOfCustomers() {
    if (this.listOfCustomers()?.length == 0) {
      this.lookupService.getListOfLookups('customers').subscribe((res) => {
        this.listOfCustomers.set(res);
      });
    }
  }

  getListOfSuppliers() {
    if (this.listOfSuppliers()?.length == 0) {
      this.lookupService.getListOfLookups('suppliers').subscribe((res) => {
        this.listOfSuppliers.set(res);
      });
    }
  }

  getListOfInvoices() {
    if (this.listOfInvoices()?.length == 0) {
      this.lookupService.getListOfLookups('invoices').subscribe((res) => {
        this.listOfInvoices.set(res);
      });
    }
  }

  getInvoiceDetails(filter: any) {
    return this.api.getDataFromServer(
      reportsApis.getInvoiceDetails,
      { count: null, page: null },
      filter
    );
  }

  downloadReport(type: string, filter?: any) {
    this.api.downloadFile(type, filter).subscribe((res) => {
      this.api.handleDownloadDocument(res, type, 'xlsx');
    });
  }
}
