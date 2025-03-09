import { formatDate } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { TRANSACTION_APIS } from './transaction.apis';

@Injectable({
  providedIn: 'root',
})
export class RepaymentService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  listOfSuppliers = signal([]);
  listOfInvoices = signal([]);
  transactionDeleted = signal(false);

  TransactionHeaders = [
    'name',
    'supplier',
    'amount',
    'invoiceNumber',
    'transactionDate',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`transaction/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      supplier: form.get('supplierNumber')?.value.id,
      invoice: form.get('invoiceNumber')?.value.id,
      customer: form.get('customer')?.value.id,
      discription: form.get('description')?.value,
      amount: form.get('remainingAmount')?.value,
      pay_date: formatDate(
        form.get('transactionDate')?.value,
        'YYYY-MM-dd',
        'en-US'
      ),
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    const selectedCustomer = this.listOfCustomers().find(
      (item: any) => item.name === data.customer
    );
    const selectedSupplier = this.listOfSuppliers().find(
      (item: any) => item.name === data.supplier
    );
    const selectedInvoice = this.listOfInvoices().find(
      (item: any) => item.invoice_number === data.invoice
    );
    form.patchValue({
      customer: selectedCustomer,
      invoiceNumber: selectedInvoice,
      supplierNumber: selectedSupplier,
      remainingAmount: data.amount,
      transactionDate: new Date(data.pay_date),
      description: data.discription,
    });
  }

  apiModelToComponentModelList(
    data: {
      customer: string;
      invoice: string;
      supplier: string;
      amount: string;
      pay_date: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.customer,
        invoiceNumber: item.invoice,
        supplier: item.supplier,
        amount: item.amount,
        transactionDate: item.pay_date,
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
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getTransactionById(id: string) {
    return this.apiService.getDataFromServer(
      TRANSACTION_APIS.GET_TRNSACTION(+id)
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
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  deleteTransaction(id: string) {
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
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }
}
