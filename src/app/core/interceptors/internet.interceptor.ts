import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationMessageService } from '../services/notification.message.service';

@Injectable()
export class InternetInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationMessageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check to see if there's internet
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      this.notificationService.showErrorMessage("No Internet, Make sure that you are connected to a network");
      return throwError({ message: 'no internet' })

    } else {
      // else return the normal request
      return next.handle(request);
    }
  }
}
