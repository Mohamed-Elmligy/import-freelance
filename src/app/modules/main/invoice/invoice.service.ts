import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ShowMessageService } from '../../../core/services/show-message.service';
import { INVOICE_APIS } from './invoice.apis';
import { formatDate, Location } from '@angular/common';
import { ConfirmSaveDeleteService } from '../../../core/services/confirm-save-delete.service';
import { map, catchError } from 'rxjs/operators';

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
    'SUPPLIER_NAME',
    'invoiceDate',
    'totalAmount',
    'netAmount',
  ];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `invoice/list`,
      { page, count: size },
      filter
    );
  }

  componentModelToApiModel(form: FormGroup) {
    const formatPaymentDate = (date: any) =>
      date ? formatDate(date, 'yyyy-MM-dd', 'en') : null;

    // Check if required fields exist (only customer and supplier are required)
    if (!form.value.customer || !form.value.supplier) {
      throw new Error('Required fields (customer or supplier) are missing');
    }

    return {
      item_category: form.value.item_category?.id || null, // Handle optional item_category
      customer: form.value.customer.id,
      supplier: form.value.supplier.id,
      invoice_number: form.value.invoice_number,
      invoice_date: formatDate(form.value.invoice_date, 'yyyy-MM-dd', 'en'),
      total_amount: form.value.total_amount,
      net_amount: form.value.net_amount,
      discount_amount: form.value.discount_amount ?? 0,
      total_boxes: form.value.total_boxes,
      total_cbm: form.value.total_cbm,
      total_store_cbm: form.value.total_store_cbm,
      total_weight: form.value.total_weight,
      first_payment_amount: form.value.first_payment_amount,
      first_payment_date: formatPaymentDate(form.value.first_payment_date),
      second_payment_amount: form.value.second_payment_amount,
      second_payment_date: formatPaymentDate(form.value.second_payment_date),
      third_payment_amount: form.value.third_payment_amount,
      third_payment_date: formatPaymentDate(form.value.third_payment_date),
      invoice_lines: form.value.invoice_lines.map((item: any) => {
        const invoiceLine: any = {
          container_sequence: item.container_sequence,
          item_code: item.item_code,
          item_description: item.item_description || null,
          box_count: item.box_count ?? 0,
          item_in_box: item.item_in_box ?? 0,
          item_price: item.item_price ?? 0,
          store_cbm: item.store_cbm ?? 0,
          height: item.height ?? 0,
          width: item.width ?? 0,
          length: item.length ?? 0,
          weight: item.weight ?? 0,
        };
        if (item.id) {
          invoiceLine.id = item.id;
        }
        return invoiceLine;
      }),
    };
  }

  apiModelToComponentModelPatch(form: FormGroup, data: any) {
    const findItemById = (list: any[], id: any) =>
      list.find((item: any) => item.id === id);

    form.patchValue({
      item_category: findItemById(this.listOfItems(), data.item_category),
      customer: findItemById(this.listOfCustomers(), data.customer),
      supplier: findItemById(this.listOfSuppliers(), data.supplier),
      invoice_number: data.invoice_number,
      invoice_date: new Date(data.invoice_date),
      total_amount: data.total_amount,
      net_amount: data.net_amount,
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
      invoice_lines: data.invoice_lines.map((item: any) => ({
        id: item.id,
        container_sequence: item.container_sequence,
        item_code: item.item_code,
        item_description: item.item_description || null,
        box_count: item.box_count,
        item_in_box: item.item_in_box,
        item_price: item.item_price,
        total_price: item.total_price,
        store_cbm: item.store_cbm,
        height: item.height,
        width: item.width,
        length: item.length,
      })),
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
        SUPPLIER_NAME: item.supplier,
        invoiceDate: item.invoice_date,
        totalAmount: item.total_amount,
        netAmount: item.net_amount,
        id: item.id,
      };
    });
  }

  createInvoice(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    // remove all empty lines from invoice_lines
    modifiedModel.invoice_lines = modifiedModel.invoice_lines.filter(
      (line: any) =>
        line.item_code &&
        line.box_count &&
        line.item_in_box &&
        line.item_price &&
        line.store_cbm
    );
    // check if invoice_lines is empty
    if (modifiedModel.invoice_lines.length === 0) {
      this.showMessageService.showMessage(
        'error',
        'Invoice Lines Required',
        'Please add at least one invoice line'
      );
      return;
    }
    this.apiService
      .sendDataToServer(INVOICE_APIS.CREATE_INVOICE, modifiedModel)
      .pipe(
        map(() => {
          this.showMessageService.showMessage(
            'success',
            'Invoice Created',
            'Invoice has been created successfully'
          );
          this.location.back();
        })
      )
      .subscribe();
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
      .pipe(
        map(() => {
          this.showMessageService.showMessage(
            'success',
            'Invoice Updated',
            'Invoice has been updated successfully'
          );
          this.location.back();
        })
      )
      .subscribe();
  }

  deleteInvoice(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this invoice?',
      () => {
        this.deleteInvoiceApi(id);
      }
    );
  }

  deleteInvoiceLine(id: string) {
    return this.apiService.deleteDataOnServer(
      INVOICE_APIS.DELETE_INVOICE_LINE(+id)
    );
  }

  deleteInvoiceApi(id: string) {
    this.apiService
      .deleteDataOnServer(INVOICE_APIS.DELETE_INVOICE(+id))
      .pipe(
        map(() => {
          this.showMessageService.showMessage(
            'success',
            'Invoice Deleted',
            'Invoice has been deleted successfully'
          );
          this.invoiceDeleted.set(true);
        })
      )
      .subscribe();
  }
}
