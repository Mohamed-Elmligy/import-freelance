import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { auth_routes_paths } from '../../modules/auth/auth.routes';
import { BrowserStorageService } from '../services/browser-storage.service';
import { ShowMessageService } from '../services/show-message.service';

export const unauthenticationGuard: CanActivateFn = (route, state) => {
  const browserStorageService = inject(BrowserStorageService);
  const showMessageService = inject(ShowMessageService);

  const router = inject(Router);
  let haveToken = browserStorageService.get('local', 'jwtToken');

  if (!haveToken) {
    showMessageService.showMessage(
      'error',
      'Unauthenticated User',
      'Please login first'
    );
    return router.navigate([auth_routes_paths.LOGIN]);
  }
  return true;
};
