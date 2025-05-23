import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const expensesListPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

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

export const expensesViewPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

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

export const expensesEditPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

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
