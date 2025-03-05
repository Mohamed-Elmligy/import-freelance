import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_AUTH } from '../../../modules/auth/auth.api';
import { SecurityService } from '../../services/security.service';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;
const unAuthenticatedApis: string[] = [API_AUTH.LOGIN, API_AUTH.REGISTER];
const unAuthenticatedApisUrls = unAuthenticatedApis.map(
  (api) => `${baseUrl}${api}`
);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  console.log(request.url);

  if (!unAuthenticatedApisUrls.includes(request.url)) {
    const authenticatedRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${inject(SecurityService).jwtToken}`
      ),
    });
    console.log('Authenticated API');

    return next(authenticatedRequest);
  }
  console.log('Unauthenticated API');

  return next(request);
};
