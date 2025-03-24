import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { CUSTOMER_APIS } from './customer.apis';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { Location } from '@angular/common';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  private confirmService = inject(ConfirmSaveDeleteService);
  private location = inject(Location);
  customerDeleted = signal(false);

  customerHeaders = ['name', 'email', 'code', 'commission', 'created_at'];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `customer/list`,
      { page, size },
      filter
    );
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
      created_at: string;
      commession: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.name,
        email: item.email,
        code: item.code,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        commission: item.commession,
        id: item.id,
      };
    });
  }

  createCustomerApi(data: FormGroup) {
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
    this.confirmService.confirmSave(
      'Are you sure you want to update this customer?',
      () => {
        this.updateCustomerApi(data, id);
      }
    );
  }
  updateCustomerApi(data: FormGroup, id: string) {
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
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this invoice?',
      () => {
        this.deleteCustomerApi(id);
      }
    );
  }

  deleteCustomerApi(id: string) {
    this.apiService
      .deleteDataOnServer(CUSTOMER_APIS.DELETE_CUSTOMER(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Customer Deleted',
            'Customer has been deleted successfully'
          );
          this.customerDeleted.set(true);
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }
}
