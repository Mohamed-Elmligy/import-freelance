import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShowMessageService } from '../../services/show-message.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { SecurityService } from '../../services/security.service';
import { BrowserStorageService } from '../../services/browser-storage.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const showMessageService = inject(ShowMessageService);
  const securityService = inject(SecurityService);
  const browserStorageService = inject(BrowserStorageService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
        showMessageService.showMessage('error', 'Error', errorMessage);
        return throwError(() => error);
      }

      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server.';
          break;
          case 400:
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else {
              errorMessage = handleBadRequestErrors(error.error);
            }
            break;
        case 401:
          if (error.error?.code === 'token_not_valid') {
            return securityService.getNewAccessToken().pipe(
              switchMap((response: any) => {
                updateJwtData(response.access);
                const clonedRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.access}`,
                  },
                });
                return next(clonedRequest);
              })
            );
          }
          errorMessage =
            error.error?.detail || 'Unauthorized. Please log in first.';
          router.navigate(['/auth/login']);
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error.';
          break;
        default:
          errorMessage =
            error.error?.message || `Unexpected Error: ${error.status}`;
          break;
      }

      showMessageService.showMessage('error', 'Error', errorMessage);
      return throwError(() => error);
    })
  );

  function handleBadRequestErrors(errors: any): string {
    const messages: string[] = [];

    for (const key in errors) {
      if (Array.isArray(errors[key])) {
        errors[key].forEach((item: any) => {
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
      } else if (typeof errors[key] === 'string') {
        messages.push(errors[key]);
      }
    }

    return messages.join(', ');
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
