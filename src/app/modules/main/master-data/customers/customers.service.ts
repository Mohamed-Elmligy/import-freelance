import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { CUSTOMER_APIS } from './customer.apis';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  private location = inject(Location);

  customerHeaders = ['name', 'email', 'code', 'commission', 'actions'];

  getList() {
    return this.apiService.getDataFromServer(`customer/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      name: form.get('name')?.value,
      email: form.get('email')?.value,
      code: form.get('customerCode')?.value,
      commession: form.get('commission')?.value,
      description: form.get('description')?.value,
    };
  }

  apiModelToComponentModelPathch(form: FormGroup, data: any) {
    form.patchValue({
      name: data.name,
      email: data.email,
      customerCode: data.code,
      commission: data.commession,
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      name: string;
      email: string;
      code: string;
      commession: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.name,
        email: item.email,
        code: item.code,
        commission: item.commession,
      };
    });
  }

  createCustomer(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(CUSTOMER_APIS.CREATE_CUSTOMER, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Customer Created',
            'Customer has been created successfully'
          );
          this.location.back();
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getCustomerById(id: string) {
    return this.apiService.getDataFromServer(CUSTOMER_APIS.GET_CUSTOMER(+id));
  }

  updateCustomer(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        CUSTOMER_APIS.UPDATE_CUSTOMER(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Customer Updated',
            'Customer has been updated successfully'
          );

          this.location.back();
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  deleteCustomer(id: string) {
    this.apiService
      .deleteDataOnServer(CUSTOMER_APIS.DELETE_CUSTOMER(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Customer Deleted',
            'Customer has been deleted successfully'
          );
          this.getList();
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }
}
