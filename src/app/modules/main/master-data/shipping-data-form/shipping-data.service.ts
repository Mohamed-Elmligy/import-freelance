import { formatDate, Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { SHIPPING_DATA_APIS } from './shippingData.apis';

@Injectable({
  providedIn: 'root',
})
export class ShippingDataService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  shippingDataDeleted = signal(false);

  ShippingHeaders = [
    'name',
    'containerNumber',
    'amount',
    'ShippingDate',
    'port',
    'created_at',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`shipment/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      customer: form.get('name')?.value.id,
      container_number: form.get('containerNumber')?.value,
      container_sequence: form.get('containerSequence')?.value,
      port_name: form.get('port')?.value,
      shipping_date: formatDate(
        form.get('ShippingDate')?.value,
        'YYYY-MM-dd',
        'en-US'
      ),
      description: form.get('description')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    const selectedCustomer = this.listOfCustomers().find(
      (item: any) => item.id === data.customer
    );
    form.patchValue({
      name: selectedCustomer,
      containerNumber: data.container_number,
      containerSequence: data.container_sequence,
      port: data.port_name,
      ShippingDate: new Date(data.shipping_date),
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      customer: string;
      container_number: string;
      container_sequence: number;
      shipping_date: string;
      port_name: string;
      created_at: string;
      actions: string;
      id: number;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.customer,
        containerNumber: item.container_number,
        amount: item.container_sequence,
        ShippingDate: item.shipping_date,
        port: item.port_name,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        id: item.id,
      };
    });
  }

  createShipping(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(SHIPPING_DATA_APIS.CREATE_SHIPPING_DATA, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Shipping Created',
            'Shipping has been created successfully'
          );
          this.location.back();
        },
      });
  }

  getShippingById(id: string) {
    return this.apiService.getDataFromServer(
      SHIPPING_DATA_APIS.GET_SHIPPING_DATA(+id)
    );
  }

  getShippingByIdForUpdate(id: string) {
    return this.apiService.getDataFromServer(
      SHIPPING_DATA_APIS.GET_SHIPPING_DATA_FOR_UPDATE(+id)
    );
  }

  updateShipping(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        SHIPPING_DATA_APIS.UPDATE_SHIPPING_DATA(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Shipping Updated',
            'Shipping has been updated successfully'
          );
          this.location.back();
        },
      });
  }

  deleteShipping(id: string) {
    this.apiService
      .deleteDataOnServer(SHIPPING_DATA_APIS.DELETE_SHIPPING_DATA(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Shipping Deleted',
            'Shipping has been deleted successfully'
          );
          this.shippingDataDeleted.set(true);
        },
      });
  }
}
