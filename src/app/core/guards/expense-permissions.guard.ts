import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const expensesListPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.expenses.includes('view_expenses')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view expenses list'
    );
    return false;
  }
  return true;
};

export const expensesViewPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.expenses.includes('view_expenses')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view expenses view'
    );
    return false;
  }
  return true;
};

export const expensesEditPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.expenses.includes('edit_expenses')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view expenses edit'
    );
    return false;
  }
  return true;
};
