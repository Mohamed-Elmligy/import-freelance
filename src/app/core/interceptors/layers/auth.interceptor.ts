import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_AUTH } from '../../../modules/auth/auth.api';
import { SecurityService } from '../../services/security.service';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;
const unAuthenticatedApis: string[] = [
  API_AUTH.LOGIN,
  API_AUTH.REGISTER,
  API_AUTH.CONFIRM_EMAIL,
  API_AUTH.VERIFY_OTP,
  API_AUTH.CONFIRM_EMAIL,
  API_AUTH.FORGET_PASSWORD_REQUEST,
  API_AUTH.FORGET_PASSWORD_CHANGE,
];
const unAuthenticatedApisUrls = unAuthenticatedApis.map(
  (api) => `${baseUrl}${api}`
);

function isUnAuthenticatedApi(url: string): boolean {
  return unAuthenticatedApisUrls.includes(url);
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const securityService = inject(SecurityService);

  if (isUnAuthenticatedApi(request.url)) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${securityService.jwtToken}`,
    },
  });

  return next(authenticatedRequest);
};
