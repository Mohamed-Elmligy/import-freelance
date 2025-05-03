import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const suppliersListPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.suppliers.includes('view_suppliers')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view suppliers list'
    );
    return false;
  }
  return true;
};

export const suppliersViewPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.suppliers.includes('view_suppliers')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view suppliers view'
    );
    return false;
  }
  return true;
};

export const suppliersEditPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.suppliers.includes('edit_suppliers')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view suppliers edit'
    );
    return false;
  }
  return true;
};
