import { formatDate, Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { PAYMENT_APIS } from './payment.apis';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  paymentDeleted = signal(false);

  PaymentHeaders = ['name', 'amount', 'paymentDate', 'created_at'];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `payments/list`,
      { page, count: size },
      filter
    );
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      customer: form.get('name')?.value.id,
      amount: form.get('amount')?.value,
      payment_date: formatDate(
        form.get('paymentDate')?.value,
        'YYYY-MM-dd',
        'en-US'
      ),
      description: form.get('description')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    const selectedCustomer = this.listOfCustomers().find(
      (item: any) => item.name === data.customer
    );
    form.patchValue({
      name: selectedCustomer,
      amount: data.amount,
      paymentDate: new Date(data.payment_date),
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      customer: string;
      name: string;
      container_number: string;
      amount: string;
      payment_date: string;
      description: string;
      created_at: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.customer,
        payment: item.name,
        amount: item.amount,
        paymentDate: item.payment_date,
        description: item.description,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        id: item.id,
      };
    });
  }

  createPayment(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(PAYMENT_APIS.CREATE_PAYMENT, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Payment Created',
            'Payment has been created successfully'
          );
          this.location.back();
        },
      });
  }

  getPaymentById(id: string) {
    return this.apiService.getDataFromServer(PAYMENT_APIS.GET_PAYMENT(+id));
  }

  updatePayment(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        PAYMENT_APIS.UPDATE_PAYMENT(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Payment Updated',
            'Payment has been updated successfully'
          );
          this.location.back();
        },
      });
  }

  deletePayment(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this payment?',
      () => {
        this.deletePaymentApi(id);
      }
    );
  }

  deletePaymentApi(id: string) {
    this.apiService
      .deleteDataOnServer(PAYMENT_APIS.DELETE_PAYMENT(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Payment Deleted',
            'Payment has been deleted successfully'
          );
          this.paymentDeleted.set(true);
        },
      });
  }
}
