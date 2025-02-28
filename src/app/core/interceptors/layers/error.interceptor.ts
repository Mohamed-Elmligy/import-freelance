import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const translateService = inject(TranslateService);
  const authService = inject(AuthenticationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        // detail: translateService.instant("NO_AVAILABLE_RESPONSE"),
      }

      // 1- Global errors handling
      if (globalErrors.has(error.status)) {
        return throwError(() => {
          // detail: translateService.instant(globalErrors.get(error.status)!)
          return error;
        });
      }

      // 2- Bad Requests to be handled locally [ex. Validation errors]
      if (error.status === 400) {
        return throwError(() => error);
      }

      // 3- Unauthenticated requests
      if (error.status === 401) {
        // return authStore.refreshToken().pipe(
        //   switchMap((response: any) => {
        //     // TODO: separate loggedIn user data from tokens & sync token update with browser storage
        //     authStore.loginInfo = {
        //       ...authService.user,
        //       access: response.access,
        //     };
        //     request = request.clone({
        //       setHeaders: {
        //         Authorization: `Bearer ${response.access}`,
        //       },
        //     });
        //     return next(request);
        //   }),
        //   catchError((refreshTokenError) => {
        //     return throwError(() => {
        //       // TODO: handle logout
        //       authStore.logout();
        //       return refreshTokenError;
        //     });
        //   })
        // );
      }

      // 4- unauthorized requests
      if (error.status === 403) {
        return throwError(() => {
          // detail: translateService.instant("USER_NOT_AUTHORIZED"),
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
