import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const translateService = inject(TranslateService);
  const baseURL = environment.baseUrl;
  if (request.url.startsWith('http') || request.url.startsWith('https')) {
    // If the request URL is absolute (starts with http or https), do not modify it
    return next(request);
  }
  const modifiedRequest = request.clone({
    url: `${baseURL}${request.url}`,
    setHeaders: {
      'Accept-Language': translateService.currentLang,
    },
  });

  return next(modifiedRequest);
};
