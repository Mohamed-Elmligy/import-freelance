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
  if (!isUnAuthenticatedApi(request.url)) {
    const authenticatedRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${inject(SecurityService).jwtToken}`
      ),
    });
    return next(authenticatedRequest);
  }
  return next(request);
};
