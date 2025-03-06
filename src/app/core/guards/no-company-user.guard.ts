import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { main_routes_paths } from '../../modules/main/main.routes';
import { BrowserStorageService } from '../services/browser-storage.service';
import { ShowMessageService } from '../services/show-message.service';

export const noCompanyUserGuard: CanActivateFn = (route, state) => {
  const browserStorageService = inject(BrowserStorageService);
  const showMessageService = inject(ShowMessageService);
  const router = inject(Router);

  let UserHaveCompany = browserStorageService.get('local', 'jwtToken').company;

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
