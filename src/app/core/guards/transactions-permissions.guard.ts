import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const transactionsListPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.transactions.includes('view_transactions')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view transactions list'
    );
    return false;
  }
  return true;
};

export const transactionsViewPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.transactions.includes('view_transactions')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view transactions view'
    );
    return false;
  }
  return true;
};

export const transactionsEditPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.transactions.includes('edit_transactions')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view transactions edit'
    );
    return false;
  }
  return true;
};
