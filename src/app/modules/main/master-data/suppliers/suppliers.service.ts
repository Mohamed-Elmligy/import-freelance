import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { SUPPLIERS_APIS } from './suppliers.apis';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  suppliertDeleted = signal(false);

  SupplierHeaders = [
    'SUPPLIER_NAME',
    'email',
    'SUPPLIER_CODE',
    'store_number',
    'created_at',
  ];

  getList(page?: any, size?: any) {
    return this.apiService.getDataFromServer(`supplier/list`, { page, size });
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      name: form.get('supplierName')?.value,
      email: form.get('email')?.value,
      code: form.get('customerCode')?.value,
      store_number: form.get('storeNumber')?.value,
      description: form.get('description')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    form.patchValue({
      supplierName: data.name,
      email: data.email,
      customerCode: data.code,
      storeNumber: data.store_number,
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      id: number;
      name: string;
      email: string;
      code: string;
      created_at: string;
      store_number: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        id: item.id,
        SUPPLIER_NAME: item.name,
        email: item.email,
        SUPPLIER_CODE: item.code,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        store_number: item.store_number,
      };
    });
  }

  createSupplier(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(SUPPLIERS_APIS.CREATE_SUPPLIERS, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Supplier Created',
            'Supplier has been created successfully'
          );
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getSupplierById(id: string) {
    return this.apiService.getDataFromServer(SUPPLIERS_APIS.GET_SUPPLIERS(+id));
  }

  updateSupplier(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        SUPPLIERS_APIS.UPDATE_SUPPLIERS(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Supplier Updated',
            'Supplier has been updated successfully'
          );
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  deleteSupplier(id: string) {
    this.apiService
      .deleteDataOnServer(SUPPLIERS_APIS.DELETE_SUPPLIERS(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Supplier Deleted',
            'Supplier has been deleted successfully'
          );
          this.suppliertDeleted.set(true);
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getSupplierSequence() {
    return this.apiService.getDataFromServer(
      SUPPLIERS_APIS.GET_SUPPLIER_SEQUENCE
    );
  }
}
