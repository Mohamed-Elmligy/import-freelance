import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, throwError, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ShowMessageService } from '../../services/show-message.service';
import { SecurityService } from '../../services/security.service';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { Router } from '@angular/router';
import { auth_routes_paths } from '../../../modules/auth/auth.routes';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const translateService = inject(TranslateService);
  const messages = inject(ShowMessageService);
  const securityService = inject(SecurityService);
  const browserStorageService = inject(BrowserStorageService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        messages.showMessage('error', 'Error', 'Server is not reachable');
        return throwError(() => error);
      }

      // 1- Global errors handling
      if (globalErrors.has(error.status)) {
        messages.showMessage(
          'error',
          'Error',
          translateService.instant(globalErrors.get(error.status)!)
        );
        return throwError(() => error);
      }

      // 2- Bad Requests to be handled locally [ex. Validation errors]
      if (error.status === 400) {
        let errorMessages: string[] = [];

        // Handle error response format: { email: ["user with this email already exists."] }
        if (error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (Array.isArray(error.error[key])) {
              errorMessages.push(...error.error[key]);
            } else if (typeof error.error[key] === 'string') {
              errorMessages.push(error.error[key]);
            }
          }
        }

        // Handle error response format: { error: string | string[] }
        else if (error.error?.error) {
          errorMessages = Array.isArray(error.error.error)
            ? error.error.error
            : [error.error.error];
        }

        // Display error messages
        if (errorMessages.length > 0) {
          messages.showMessage(
            'error',
            'Error',
            errorMessages
              .map((error: string) => translateService.instant(error))
              .join('<br>')
          );
        } else {
          messages.showMessage('error', 'Error', 'An unknown error occurred.');
        }

        return throwError(() => error);
      }

      // 3- Unauthenticated requests
      if (error.status === 401) {
        const refreshToken = securityService.retrieveRefreshToken();
        if (!refreshToken) {
          handleUnauthorizedError();
          return throwError(() => error);
        }

        return securityService.getNewAccessToken().pipe(
          switchMap((res: any) => {
            updateJwtData(res.access);
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` },
            });
            return next(request);
          }),
          catchError(() => {
            handleUnauthorizedError();
            return throwError(() => error);
          })
        );
      }

      function handleUnauthorizedError() {
        securityService.removeToken();
        browserStorageService.removeData('local', securityService.localKey);
        router.navigate([auth_routes_paths.LOGIN]);
        messages.showMessage(
          'error',
          'Error',
          translateService.instant('USER_NOT_AUTHORIZED')
        );
      }

      function updateJwtData(accessToken: string): void {
        const jwtData = securityService.allJwtData;
        const newJwtData = { ...jwtData, access: accessToken };
        securityService.allJwtData.update(() => newJwtData);
        browserStorageService.setData('local', securityService.localKey, newJwtData);
      }

      // 4- Unauthorized requests
      // if (error.status === 401) {
      //   messages.showMessage(
      //     'error',
      //     'Error',
      //     translateService.instant('USER_NOT_AUTHORIZED')
      //   );
      //   return throwError(() => error);
      // }

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
