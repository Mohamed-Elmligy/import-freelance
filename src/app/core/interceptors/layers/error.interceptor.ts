import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShowMessageService } from '../../services/show-message.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const showMessageService = inject(ShowMessageService);

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
            break;
          case 400:
            errorMessage = handleBadRequest(error.error).join(', ');
            // errorMessage = error.error?.error || 'Bad request.';
            break;
          case 401:            
            errorMessage = error.error?.detail || 'Unauthorized. Please log in first.';
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
            errorMessage = error.error?.message || `Unexpected Error: ${error.status}`;
            break;
        }

        showMessageService.showMessage('error', 'Error', errorMessage);
      }

      return throwError(() => error);
    })
  );
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