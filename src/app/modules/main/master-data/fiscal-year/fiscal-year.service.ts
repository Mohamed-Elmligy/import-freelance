import { formatDate, Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { FISCAL_YEAR_APIS } from './fiscal-year.api';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class FiscalYearService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  private showMessageService = inject(ShowMessageService);
  yearDeleted = signal(false);

  yearHeaders = [
    'FISCAL_YEAR_NAME',
    'country',
    'from_date',
    'to_date',
    'created_at',
  ];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `year/list`,
      { page, count: size },
      filter
    );
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      name: form.get('name')?.value,
      country: form.get('country')?.value,
      from_date: formatDate(
        form.get('from_date')?.value,
        'YYYY-MM-dd',
        'en-US'
      ),
      to_date: formatDate(form.get('to_date')?.value, 'YYYY-MM-dd', 'en-US'),
      is_active: form.get('is_active')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    form.patchValue({
      name: data.name,
      country: data.country,
      from_date: new Date(data.from_date),
      to_date: new Date(data.to_date),
      is_active: data.is_active,
    });
  }

  apiModelToComponentModelList(
    data: {
      name: string;
      country: string;
      amount: string;
      from_date: string;
      to_date: string;
      is_active: boolean;
      created_at: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        FISCAL_YEAR_NAME: item.name,
        country: item.country,
        from_date: item.from_date,
        to_date: item.to_date,
        is_active: item.is_active,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        id: item.id,
      };
    });
  }

  createYear(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(FISCAL_YEAR_APIS.CREATE_FISCAL_YEAR, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Year Created',
            'Year has been created successfully'
          );
          this.location.back();
        },
      });
  }

  getYearById(id: string) {
    return this.apiService.getDataFromServer(
      FISCAL_YEAR_APIS.GET_FISCAL_YEAR(+id)
    );
  }

  updateYear(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        FISCAL_YEAR_APIS.UPDATE_FISCAL_YEAR(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Year Updated',
            'Year has been updated successfully'
          );
          this.location.back();
        },
      });
  }

  deleteYear(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this year?',
      () => {
        this.deleteYearApi(id);
      }
    );
  }

  deleteYearApi(id: string) {
    this.apiService
      .deleteDataOnServer(FISCAL_YEAR_APIS.DELETE_FISCAL_YEAR(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Year Deleted',
            'Year has been deleted successfully'
          );
          this.yearDeleted.set(true);
        },
      });
  }
}
