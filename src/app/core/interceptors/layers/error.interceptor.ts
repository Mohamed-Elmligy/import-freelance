import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShowMessageService } from '../../services/show-message.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { SecurityService } from '../../services/security.service';
import { BrowserStorageService } from '../../services/browser-storage.service';

export const errorInterceptor: HttpInterceptorFn = (
  req,
  next
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const showMessageService = inject(ShowMessageService);
  const securityService = inject(SecurityService);
  const browserStorageService = inject(BrowserStorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred.';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client Error: ${error.error.message}`;
        showMessageService.showMessage('error', 'Error', errorMessage);     
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to the server.';
          case 400:
            errorMessage = handleBadRequest(error.error).join(', ');
            // errorMessage = error.error?.error || 'Bad request.';
            break;
          case 401:
            const refreshToken = securityService.retrieveRefreshToken();
            if (refreshToken) {
              return securityService.getNewAccessToken().pipe(
                switchMap((res: any) => {
                  updateJwtData(res.access);
                  req = req.clone({
                    setHeaders: { Authorization: `Bearer ${res.access}` },
                  });
                  return next(req);
                }),
                catchError((refreshError: HttpErrorResponse) => {
                  return throwError(() => refreshError);
                })
              );
            } else {
              return throwError(() => error);
            }
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
      }

      return throwError(() => error);
    })
  );
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
