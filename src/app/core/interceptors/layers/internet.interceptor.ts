import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";
import { throwError } from "rxjs";

export const internetInterceptor: HttpInterceptorFn = (req, next) => {
  const translation = inject(TranslateService);
  if (!window.navigator.onLine) {
    const errorMessage = translation.instant("NO_INTERNET_CONNECTION");

    // detail: errorMessage,
    return throwError(() => errorMessage);
  }
  return next(req);
};
