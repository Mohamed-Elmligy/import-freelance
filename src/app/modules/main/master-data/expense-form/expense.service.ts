import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { EXPENSE_APIS } from './expense.apis';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);

  ExpenseHeaders = [
    'customer',
    'container_number',
    'amount',
    'expense_date',
    'description',
    'actions',
  ];

  getList() {
    return this.apiService.getDataFromServer(`expenses/list`);
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      customer: form.get('name')?.value,
      container_number: form.get('containerNumber')?.value,
      amount: form.get('amount')?.value,
      expense_date: form.get('expenseDate')?.value,
      description: form.get('description')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    form.patchValue({
      name: data.customer,
      containerNumber: data.container_number,
      amount: data.amount,
      expenseDate: data.expense_date,
      description: data.description,
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
        },
        error: (err) => {
          this.showMessageService.showMessage('error', 'Error', err.error);
        },
      });
  }
}
