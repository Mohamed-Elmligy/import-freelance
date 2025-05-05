import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const invoicesListPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.invoices.includes('view_invoices')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view invoices list'
    );
    return false;
  }
  return true;
};

export const invoicesViewPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.invoices.includes('view_invoices')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view invoices view'
    );
    return false;
  }
  return true;
};

export const invoicesEditPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.invoices.includes('edit_invoices')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view invoices edit'
    );
    return false;
  }
  return true;
};
