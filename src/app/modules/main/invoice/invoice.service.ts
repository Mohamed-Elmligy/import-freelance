import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ShowMessageService } from '../../../core/services/show-message.service';
import { INVOICE_APIS } from './invoice.apis';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  private location = inject(Location);
  invoiceDeleted = signal(false);

  invoiceHeaders = [
    'invoiceNumber',
    'name',
    'supplierName',
    'invoiceDate',
    'totalAmount',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`invoice/list`);
  }

  componentModelToApiModel(form: FormGroup) {}

  apiModelToComponentModelPathch(form: FormGroup, data: any) {}

  apiModelToComponentModelList(
    data: {
      invoice_number: string;
      customer: string;
      supplier: string;
      invoice_date: string;
      total_amount: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        invoiceNumber: item.invoice_number,
        name: item.customer,
        supplierName: item.supplier,
        invoiceDate: item.invoice_date,
        totalAmount: item.total_amount,
        id: item.id,
      };
    });
  }

  createInvoice(data: FormGroup) {
    // let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(INVOICE_APIS.CREATE_INVOICE, {})
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Invoice Created',
            'Invoice has been created successfully'
          );
          this.location.back();
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getInvoiceById(id: string) {
    return this.apiService.getDataFromServer(INVOICE_APIS.GET_INVOICE(+id));
  }

  updateInvoice(data: FormGroup, id: string) {
    // let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer('put', INVOICE_APIS.UPDATE_INVOICE(+id), {})
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Invoice Updated',
            'Invoice has been updated successfully'
          );

          this.location.back();
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  deleteInvoice(id: string) {
    this.apiService
      .deleteDataOnServer(INVOICE_APIS.DELETE_INVOICE(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Invoice Deleted',
            'Invoice has been deleted successfully'
          );
          this.invoiceDeleted.set(true);
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }
}
