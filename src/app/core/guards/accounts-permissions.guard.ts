import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const accountsListPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.accounts.includes('view_accounts')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view accounts list'
    );
    return false;
  }
  return true;
};

export const accountsViewPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.accounts.includes('view_accounts')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view accounts view'
    );
    return false;
  }
  return true;
};

export const accountsEditPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.accounts.includes('edit_accounts')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view accounts edit'
    );
    return false;
  }
  return true;
};
