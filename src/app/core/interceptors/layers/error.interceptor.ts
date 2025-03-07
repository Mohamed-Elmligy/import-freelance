import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ShowMessageService } from '../../services/show-message.service';
import { SecurityService } from '../../services/security.service';
import { BrowserStorageService } from '../../services/browser-storage.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const translateService = inject(TranslateService);
  const messages = inject(ShowMessageService);
  const securityService = inject(SecurityService);
  const browserStorageService = inject(BrowserStorageService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        messages.showMessage('error', 'Error', 'Server is not reachable');
        return throwError(() => error);
      }

      // 1- Global errors handling
      if (globalErrors.has(error.status)) {
        return throwError(() => {
          messages.showMessage(
            'error',
            'Error',
            translateService.instant(globalErrors.get(error.status)!)
          );
          return error;
        });
      }

      // 2- Bad Requests to be handled locally [ex. Validation errors]
      if (error.status === 400) {
        return throwError(() => error);
      }

      // 3- Unauthenticated requests
      if (error.status === 403) {
        let refreshToken = securityService.retrieveRefreshToken();
        if (refreshToken) {
          securityService.getNewAccessToken().subscribe((res: any) => {
            let oldJWT = securityService.allJwtData();
            console.log(oldJWT);

            // browserStorageService.set('local', securityService.localKey, {
            //   ...oldJWT,
            //   oldJWT.access: res.access,
            // });
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access}`,
              },
            });
          });
          return next(request);
        }
      }

      // 4- unauthorized requests
      if (error.status === 403) {
        return throwError(() => {
          messages.showMessage(
            'error',
            'Error',
            translateService.instant('USER_NOT_AUTHORIZED')
          );
          return error;
        });
      }

      return EMPTY;
    })
  );
};

const globalErrors = new Map<number, string>([
  [504, 'GATEWAY_TIMEOUT'],
  [503, 'SERVICE_NOT_AVAILABLE'],
  [502, 'BAD_GATEWAY'],
  [500, 'INTERNAL_SERVER_ERROR'],

  [413, 'PAYLOAD_TOO_LARGE'],
  [408, 'REQUEST_TIMEOUT'],
  [405, 'REQUEST_METHOD_NOT_ALLOWED'],
  [404, 'REQUEST_URL_NOT_FOUND'],
]);
