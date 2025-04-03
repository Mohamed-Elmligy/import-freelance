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

      if (globalErrors.has(error.status)) {
        messages.showMessage(
          'error',
          'Error',
          translateService.instant(globalErrors.get(error.status)!)
        );
        return throwError(() => error);
      }

      if (error.status === 400) {
        handleBadRequest(error);
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
    })
  );

  function handleBadRequest(error: HttpErrorResponse) {
    let errorMessages: string[] = [];

    if (error.error && typeof error.error === 'object') {
      for (const key in error.error) {
        if (Array.isArray(error.error[key])) {
          errorMessages.push(...error.error[key]);
        } else if (typeof error.error[key] === 'string') {
          errorMessages.push(error.error[key]);
        }
      }
    } else if (error.error?.error) {
      errorMessages = Array.isArray(error.error.error)
        ? error.error.error
        : [error.error.error];
    }

    if (errorMessages.length > 0) {
      messages.showMessage(
        'error',
        'Error',
        errorMessages.map((msg) => translateService.instant(msg)).join('<br>')
      );
    } else {
      messages.showMessage('error', 'Error', 'An unknown error occurred.');
    }
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
