import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { EXPENSE_APIS } from './expense.apis';
import { formatDate, Location } from '@angular/common';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  expenseDeleted = signal(false);

  ExpenseHeaders = [
    'name',
    'containerSequance',
    'amount',
    'expenseDate',
    'created_at',
  ];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `expenses/list`,
      { page, count: size },
      filter
    );
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      customer: form.get('name')?.value.id,
      container_number: form.get('containerNumber')?.value,
      amount: form.get('amount')?.value,
      expense_date: formatDate(
        form.get('expenseDate')?.value,
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
      amount: data.amount,
      expenseDate: new Date(data.expense_date),
      description: data.description,
    });
  }

  apiModelToComponentModelList(
    data: {
      customer: string;
      container_number: string;
      amount: string;
      expense_date: string;
      description: string;
      created_at: string;
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.customer,
        containerSequance: item.container_number,
        amount: item.amount,
        expenseDate: item.expense_date,
        description: item.description,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        id: item.id,
      };
    });
  }

  createExpense(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(EXPENSE_APIS.CREATE_EXPENSE, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Expense Created',
            'Expense has been created successfully'
          );
          this.location.back();
        },
      });
  }

  getExpenseById(id: string) {
    return this.apiService.getDataFromServer(EXPENSE_APIS.GET_EXPENSE(+id));
  }

  getExpenseByIdForUpdate(id: string) {
    return this.apiService.getDataFromServer(
      EXPENSE_APIS.GET_EXPENSE_FOR_UPDATE(+id)
    );
  }

  updateExpense(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        EXPENSE_APIS.UPDATE_EXPENSE(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Expense Updated',
            'Expense has been updated successfully'
          );
          this.location.back();
        },
      });
  }

  deleteExpense(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this expense?',
      () => {
        this.deleteExpenseApi(id);
      }
    );
  }

  deleteExpenseApi(id: string) {
    this.apiService
      .deleteDataOnServer(EXPENSE_APIS.DELETE_EXPENSE(+id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Expense Deleted',
            'Expense has been deleted successfully'
          );
          this.expenseDeleted.set(true);
        },
      });
  }
}
