import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';

export const customersListPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.customers.includes('view_customers')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view customers list'
    );
    return false;
  }
  return true;
};

export const customersViewPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.customers.includes('view_customers')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view customers view'
    );
    return false;
  }
  return true;
};

export const customersEditPermissionsGuard: CanActivateFn = (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  if (
    !userPermissionsService
      .userPermissions()
      ?.permissions.customers.includes('edit_customers')
  ) {
    showMessageService.showMessage(
      'warn',
      'Permission Denied',
      'You do not have permission to view customers edit'
    );
    return false;
  }
  return true;
};
