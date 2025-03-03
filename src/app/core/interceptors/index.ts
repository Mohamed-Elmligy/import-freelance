import { HttpInterceptorFn } from '@angular/common/http';
import { authInterceptor } from './layers/auth.interceptor';
import { httpInterceptor } from './layers/http.interceptor';

export const interceptors: HttpInterceptorFn[] = [
  httpInterceptor,
  authInterceptor,
];
