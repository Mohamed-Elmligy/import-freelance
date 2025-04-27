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
  todayDate = new Date().toISOString().split('T')[0];

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

  reportApi(api: keyof typeof reportsApis, filter: any) {
    return this.api.getDataFromServer(
      this.getApiEndpoint(api),
      { count: null, page: null },
      filter
    );
  }

  getApiEndpoint(key: keyof typeof reportsApis): string {
    return reportsApis[key];
  }

  downloadReport(fileType: string, type: string, filter?: any, fileName?: any) {
    if (fileType == 'excel') {
      this.api.downloadFile(type, filter).subscribe((res) => {
        this.api.handleDownloadDocument(
          res,
          fileName + '_' + this.todayDate,
          'xlsx'
        );
      });
    } else if (fileType == 'pdf') {
      this.api.downloadFile(type, filter).subscribe((res) => {
        this.api.handleDownloadDocument(
          res,
          fileName + '_' + this.todayDate,
          'pdf'
        );
      });
    }
  }
}

export type reportVewType = {
  totals: totalsType;
  results: resultsType[];
};

export type totalsType = {
  box_count: number;
  item_in_box: number;
  item_price: number;
  total_price: number;
  total_cbm: number;
  total_weight: number;
};

export type resultsType = {
  invoice_number: string;
  customer_code: string;
  container_sequence: number;
  item_code: string;
  item_description: string;
  box_count: number;
  item_in_box: number;
  item_price: number;
  store_cbm: number;
  Width: number;
  Length: number;
  Height: number;
  total_price: number;
  total_cbm: number;
  total_weight: number;
};
