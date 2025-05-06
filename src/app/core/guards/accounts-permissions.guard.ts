import { CanActivateFn } from '@angular/router';
import { UserPermissionService } from '../../services/user-permission.service';
import { inject } from '@angular/core';
import { ShowMessageService } from '../services/show-message.service';
import { firstValueFrom } from 'rxjs';

export const accountsListPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

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

export const accountsViewPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

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

export const accountsEditPermissionsGuard: CanActivateFn = async (route, state) => {
  const userPermissionsService = inject(UserPermissionService);
  const showMessageService = inject(ShowMessageService);

  // If permissions are not loaded, try to load them
  if (!userPermissionsService.userPermissions()) {
    await userPermissionsService.loadUserPermissions();
  }

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
