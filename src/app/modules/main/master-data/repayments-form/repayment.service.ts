import { formatDate } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { TRANSACTION_APIS, TRANSACTION_LOOKUP_APIS } from './transaction.apis';

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
    'invoice_payment_number',
    'invoiceNumber',
    'transactionDate',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`transaction/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      invoice: form.get('invoiceNumber')?.value.id,
      discription: form.get('description')?.value,
      amount: form.get('remainingAmount')?.value,
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

  paymentBatchies() {
    return [
      {
        id: 'first',
        name: 'سداد الدفعة الاولى',
      },
      {
        id: 'second',
        name: 'سداد الدفعة الثانية',
      },
      {
        id: 'third',
        name: 'سداد الدفعة الثالثة',
      },
    ];
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    const selectedInvoice = this.listOfInvoices().find(
      (item: any) => item.id === data.invoice
    );
    console.log(selectedInvoice);

    form.patchValue({
      invoiceNumber: selectedInvoice,
      remainingAmount: data.amount,
      invoice_payment_number: data.invoice_payment_number,
      transactionDate: new Date(data.pay_date),
      description: data.discription,
    });
  }

  apiModelToComponentModelList(
    data: {
      invoice: string;
      supplier: string;
      amount: string;
      invoice_payment_number: string;
      pay_date: string;
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
      });
  }
}
