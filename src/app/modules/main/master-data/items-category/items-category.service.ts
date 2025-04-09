import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { ITEM_APIS } from './item.api';
import { Location } from '@angular/common';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class ItemsCategoryService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  itemDeleted = signal(false);

  itemsHeaders = ['item', 'created_at'];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `item/list`,
      { page, count: size },
      filter
    );
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
      created_at: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        item: item.name,
        description: item.description,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
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
          this.location.back();
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
          this.location.back();
        },
      });
  }

  deleteItem(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this item?',
      () => {
        this.deleteItemApi(id);
      }
    );
  }
  deleteItemApi(id: string) {
    this.apiService.deleteDataOnServer(ITEM_APIS.DELETE_ITEM(+id)).subscribe({
      next: () => {
        this.showMessageService.showMessage(
          'success',
          'Item Deleted',
          'Item has been deleted successfully'
        );
        this.itemDeleted.set(true);
      },
    });
  }
}
