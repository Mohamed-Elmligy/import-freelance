import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_AUTH } from '../../../modules/auth/auth.api';
import { SecurityService } from '../../services/security.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const securityService = SecurityService;
  if (!unAuthenticatedApis.includes(request.url)) {
    const authenticatedRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${securityService.jwtToken}`
      ),
    });
    return next(authenticatedRequest);
  }

  return next(request);
};

const unAuthenticatedApis: string[] = [
  API_AUTH.LOGIN,
  API_AUTH.CHANGE_PASSWORD,
  API_AUTH.RESET_PASSWORD,
];
