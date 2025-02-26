import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SecurityService } from '../services/security.service';
import { MessageService } from 'primeng/api';
// import { NotificationMessageService } from "../services/notification.message.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {} // private notificationService: NotificationMessageService,
  private securityService = inject(SecurityService);
  private messageService = inject(MessageService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(0) as any,
      catchError((error: HttpErrorResponse) => {
        const errorModel = error.error;
        // customized response
        if (error.status === 0) {
          return throwError(error);
        } else if (error.status === 401) {
          if (
            errorModel.detail &&
            errorModel.detail !==
              'Authentication credentials were not provided.'
          ) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: errorModel.detail,
            });
            this.securityService.logout();
          } else this.securityService.logout();
        } else if (errorModel.response_id) {
          // validation errors (more than one)
          if (errorModel.warning) {
            const msg: string = this.handleWarningMessage(errorModel.warning);
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: msg,
            });
          } else if (errorModel.message) {
            if (
              typeof errorModel.message == 'object' &&
              errorModel.message.sago_errors
            ) {
              const msg: string = this.handleWarningMessage(
                errorModel.message.sago_errors
              );
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn',
                detail: msg,
              });
            } else {
            }
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: errorModel.detail,
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: 'Something went wrong please try again or call support.',
            });
          }
        }
        // only one message to show
        else if (
          typeof error.error === 'object' &&
          Object.keys(error.error).length === 1
        ) {
          const msg: string = Object.values(error.error)[0] as string;
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn',
            detail: msg,
          });
        }
        // direct one message
        else if (typeof error.error === 'string' && error.error.length < 200) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn',
            detail: error.error,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn',
            detail: 'Something went wrong please try again or call support.',
          });
        }
        return throwError(error);
      })
    );
  }

  handleWarningMessage(warning: any): string {
    let msg = '';
    for (const key in warning) {
      msg += `${key.charAt(0).toUpperCase() + key.slice(1)} : ${
        warning[key]
      } \n`;
    }
    return msg;
  }
}
