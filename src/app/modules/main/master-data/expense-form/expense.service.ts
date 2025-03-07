import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { EXPENSE_APIS } from './expense.apis';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  expenseDeleted = signal(false);

  ExpenseHeaders = [
    'name',
    'containerNumber',
    'amount',
    'expenseDate',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`expenses/list`);
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
      expenseDate: data.expense_date,
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
      id: string;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.customer,
        containerNumber: item.container_number,
        amount: item.amount,
        expenseDate: item.expense_date,
        description: item.description,
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
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  getExpenseById(id: string) {
    return this.apiService.getDataFromServer(EXPENSE_APIS.GET_EXPENSE(+id));
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
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }

  deleteExpense(id: string) {
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
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }
}
