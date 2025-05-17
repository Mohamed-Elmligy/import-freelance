import { formatDate, Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { TRANSACTION_APIS, TRANSACTION_LOOKUP_APIS } from './transaction.apis';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class RepaymentService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  listOfSuppliers = signal([]);
  listOfInvoices = signal([]);
  transactionDeleted = signal(false);
  paymentBatchies = signal([]);
  TransactionHeaders = [
    'name',
    'supplier',
    'amount',
    'invoice_payment_number',
    'invoiceNumber',
    'transactionDate',
    'created_at',
  ];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `transaction/list`,
      { page, count: size },
      filter
    );
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      invoice: form.get('invoiceNumber')?.value.id,
      description: form.get('description')?.value,
      amount: form.get('amount')?.value,
      pay_date: formatDate(
        form.get('transactionDate')?.value,
        'YYYY-MM-dd',
        'en-US'
      ),
      invoice_payment_number: form.get('invoice_payment_number')?.value,
    };
  }

  getInvoiceData(id: string) {
    return this.apiService.getDataFromServer(
      TRANSACTION_LOOKUP_APIS.GET_INVOICE_DATA_LOOKUP(id)
    );
  }

  getPaymentData(id: string) {
    return this.apiService.getDataFromServer(
      TRANSACTION_LOOKUP_APIS.GET_INVOICE_PAYMENT_LOOKUP(id)
    );
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    const selectedInvoice = this.listOfInvoices().find(
      (item: any) => item.id === data.invoice
    );
    form.patchValue({
      invoiceNumber: selectedInvoice,
      amount: data.amount,
      invoice_payment_number: data.invoice_payment_number,
      transactionDate: new Date(data.pay_date),
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      invoice: string;
      supplier: string;
      amount: string;
      invoice_payment_number: string;
      pay_date: string;
      created_at: string;
      id: string;
      customer: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        invoiceNumber: item.invoice,
        amount: item.amount,
        supplier: item.supplier,
        name: item.customer,
        invoice_payment_number: item.invoice_payment_number,
        transactionDate: item.pay_date,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        id: item.id,
      };
    });
  }

  createTransaction(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(TRANSACTION_APIS.CREATE_TRNSACTION, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Transaction Created',
            'Transaction has been created successfully'
          );
          this.location.back();
        },
      });
  }

  getTransactionById(id: string) {
    return this.apiService.getDataFromServer(
      TRANSACTION_APIS.GET_TRNSACTION(+id)
    );
  }

  getTransactionByIdForUpdate(id: string) {
    return this.apiService.getDataFromServer(
      TRANSACTION_APIS.GET_TRNSACTION_FOR_UPDATE(+id)
    );
  }

  updateTransaction(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        TRANSACTION_APIS.UPDATE_TRNSACTION(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Transaction Updated',
            'Transaction has been updated successfully'
          );
          this.location.back();
        },
      });
  }

  deleteTransaction(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this transaction?',
      () => {
        this.deleteTransactioneApi(id);
      }
    );
  }

  deleteTransactioneApi(id: string) {
    this.apiService
      .deleteDataOnServer(TRANSACTION_APIS.DELETE_TRNSACTION(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Transaction Deleted',
            'Transaction has been deleted successfully'
          );
          this.transactionDeleted.set(true);
        },
      });
  }
}
