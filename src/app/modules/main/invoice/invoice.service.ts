import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ShowMessageService } from '../../../core/services/show-message.service';
import { INVOICE_APIS } from './invoice.apis';
import { formatDate, Location } from '@angular/common';
import { ConfirmSaveDeleteService } from '../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  invoiceDeleted = signal(false);

  listOfCustomers = signal([]);
  listOfSuppliers = signal([]);
  listOfItems = signal([]);

  invoiceHeaders = [
    'invoiceNumber',
    'name',
    'supplierName',
    'invoiceDate',
    'totalAmount',
    'netAmount',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`invoice/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      item_category: form.value.item_category.id,
      customer: form.value.customer.id,
      supplier: form.value.supplier.id,
      invoice_number: form.value.invoice_number,
      invoice_date: formatDate(form.value.invoice_date, 'yyyy-MM-dd', 'en'),
      total_amount: form.value.total_amount,
      discount_amount: form.value.discount_amount,
      first_payment_amount: form.value.first_payment_amount,
      first_payment_date: form.value.first_payment_date
        ? formatDate(form.value.first_payment_date, 'yyyy-MM-dd', 'en')
        : null,
      second_payment_amount: form.value.second_payment_amount,
      second_payment_date: form.value.second_payment_date
        ? formatDate(form.value.second_payment_date, 'yyyy-MM-dd', 'en')
        : null,
      third_payment_amount: form.value.third_payment_amount,
      third_payment_date: form.value.third_payment_date
        ? formatDate(form.value.third_payment_date, 'yyyy-MM-dd', 'en')
        : null,
      invoice_lines: form.value.invoice_lines.map((item: any) => {
        const invoiceLine: any = {
          container_sequence: item.container_sequence,
          item_code: item.item_code,
          item_description: item.item_description,
          box_count: item.box_count,
          item_in_box: item.item_in_box,
          total_cbm: item.total_cbm,
          item_price: item.item_price,
          total_price: item.total_price,
          store_cbm: item.store_cbm,
          height: item.height,
          width: item.width,
          length: item.length,
          weight: item.weight,
        };
        if (item.id) {
          invoiceLine.id = item.id;
        }
        return invoiceLine;
      }),
    };
  }

  apiModelToComponentModelPathch(form: FormGroup, data: any) {
    const selectedCustomer = this.listOfCustomers().find(
      (item: any) => item.id === data.customer
    );
    const selectedSupplier = this.listOfSuppliers().find(
      (item: any) => item.id === data.supplier
    );
    const selectedItem = this.listOfItems().find(
      (item: any) => item.id === data.item_category
    );

    form.patchValue({
      item_category: selectedItem,
      customer: selectedCustomer,
      supplier: selectedSupplier,
      invoice_number: data.invoice_number,
      invoice_date: new Date(data.invoice_date),
      total_amount: data.total_amount,
      total_boxes: data.total_boxes,
      total_weight: data.total_weight,
      total_cbm: data.total_cbm,
      discount_amount: data.discount_amount,
      first_payment_amount: data.first_payment_amount,
      first_payment_date: data.first_payment_date
        ? new Date(data.first_payment_date)
        : null,
      second_payment_amount: data.second_payment_amount,
      second_payment_date: data.second_payment_date
        ? new Date(data.second_payment_date)
        : null,
      third_payment_amount: data.third_payment_amount,
      third_payment_date: data.third_payment_date
        ? new Date(data.third_payment_date)
        : null,
      invoice_lines: data.invoice_lines.map((item: any) => {
        return {
          id: item.id,
          container_sequence: item.container_sequence,
          item_code: item.item_code,
          item_description: item.item_description,
          box_count: item.box_count,
          item_in_box: item.item_in_box,
          item_price: item.item_price,
          total_price: item.total_price,
          store_cbm: item.store_cbm,
          height: item.height,
          width: item.width,
          length: item.length,
        };
      }),
    });
  }

  apiModelToComponentModelList(
    data: {
      invoice_number: string;
      customer: string;
      supplier: string;
      invoice_date: string;
      total_amount: string;
      net_amount: string;
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
        netAmount: item.net_amount,
        id: item.id,
      };
    });
  }

  createInvoice(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(INVOICE_APIS.CREATE_INVOICE, modifiedModel)
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

  getInvoiceByIdForUpdate(id: string) {
    return this.apiService.getDataFromServer(
      INVOICE_APIS.GET_INVOICE_FOR_UPDATE(+id)
    );
  }

  updateInvoice(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        INVOICE_APIS.UPDATE_INVOICE(+id),
        modifiedModel
      )
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
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this invoice?',
      () => {
        this.deleteInvoiceApi(id);
      }
    );
  }

  deleteInvoiceApi(id: string) {
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
