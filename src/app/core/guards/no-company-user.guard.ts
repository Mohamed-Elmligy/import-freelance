import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { main_routes_paths } from '../../modules/main/main.routes';
import { BrowserStorageService } from '../services/browser-storage.service';
import { ShowMessageService } from '../services/show-message.service';
import { UserPermissionService } from '../../services/user-permission.service';

export const noCompanyUserGuard: CanActivateFn = (route, state) => {
  const browserStorageService = inject(BrowserStorageService);
  const showMessageService = inject(ShowMessageService);
  const router = inject(Router);

  let UserHaveCompany = browserStorageService.getData(
    'local',
    'jwtToken'
  ).company;

  if (!UserHaveCompany) {
    showMessageService.showMessage(
      'warn',
      'No Company',
      'Please add company first'
    );
    return router.navigate([main_routes_paths.settings]);
  }
  return true;
};

export const userIsAdmin = () => {
  const userPermissionService = inject(UserPermissionService);

  // Get cached permissions from UserPermissionService
  // The service loads permissions in its constructor, so they should be available
  const cachedPermissions = userPermissionService.userPermissions();
  
  if (cachedPermissions?.role) {
    return cachedPermissions.role;
  }

  // If permissions are not loaded yet, return null
  // Components should handle this case or ensure permissions are loaded first
  return null;
};
