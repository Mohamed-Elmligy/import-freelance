import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
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

      if (globalErrors.has(error.status)) {
        messages.showMessage(
          'error',
          'Error',
          translateService.instant(globalErrors.get(error.status)!)
        );
        return throwError(() => error);
      }

      if (error.status === 400) {
        const errors = handleBadRequest(error.error);
        messages.showMessage('error', 'Error', errors.join(', '));
        return throwError(() => error);
      }

      if (error.status === 401) {
        const refreshToken = securityService.retrieveRefreshToken();
        if (refreshToken) {
          return securityService.getNewAccessToken().pipe(
            switchMap((res: any) => {
              updateJwtData(res.access);
              request = request.clone({
                setHeaders: { Authorization: `Bearer ${res.access}` },
              });
              return next(request);
            }),
            catchError((refreshError: HttpErrorResponse) => {
              return throwError(() => refreshError);
            })
          );
        } else {
          return throwError(() => error);
        }
      }
      return throwError(() => error);
    })
  );

  function handleBadRequest(error: any) {
    const messages: string[] = [];

    // Handle nested error format like { invoice_lines: [{ store_cbm: ["msg"] }] }
    for (const key in error) {
      if (Array.isArray(error[key])) {
        error[key].forEach((item: any) => {
          if (typeof item === 'object') {
            for (const innerKey in item) {
              if (Array.isArray(item[innerKey])) {
                item[innerKey].forEach((msg: string) => {
                  messages.push(`${innerKey}: ${msg}`);
                });
              }
            }
          } else if (typeof item === 'string') {
            messages.push(item);
          }
        });
      } else if (typeof error[key] === 'string') {
        messages.push(error[key]);
      }
    }

    return messages;
  }

  function updateJwtData(accessToken: string): void {
    const jwtData = securityService.retrieveJwtData();
    const newJwtData = { ...jwtData, access: accessToken };
    securityService.allJwtData.update(() => newJwtData);
    browserStorageService.setData(
      'local',
      securityService.localKey,
      newJwtData
    );
  }
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
