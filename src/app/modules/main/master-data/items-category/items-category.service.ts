import { formatDate } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { EXPENSE_APIS } from '../expense-form/expense.apis';
import { ITEM_APIS } from './item.api';

@Injectable({
  providedIn: 'root',
})
export class ItemsCategoryService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  itemDeleted = signal(false);

  itemsHeaders = ['item', 'actions'];

  getList() {
    return this.apiService.getDataFromServer(`item/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      name: form.get('name')?.value,
      description: form.get('description')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    form.patchValue({
      name: data.name,
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      name: string;
      description: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        item: item.name,
        description: item.description,
        id: item.id,
      };
    });
  }

  createItem(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(ITEM_APIS.CREATE_ITEM, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Item Created',
            'Item has been created successfully'
          );
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getItemById(id: string) {
    return this.apiService.getDataFromServer(ITEM_APIS.GET_ITEM(+id));
  }

  updateItem(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer('put', ITEM_APIS.UPDATE_ITEM(+id), modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Item Updated',
            'Item has been updated successfully'
          );
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  deleteItem(id: string) {
    this.apiService.deleteDataOnServer(ITEM_APIS.DELETE_ITEM(+id)).subscribe({
      next: () => {
        this.showMessageService.showMessage(
          'success',
          'Item Deleted',
          'Item has been deleted successfully'
        );
        this.itemDeleted.set(true);
      },
      error: (err) => {
        this.showMessageService.showMessage('error', 'Error', err.error);
      },
    });
  }
}
