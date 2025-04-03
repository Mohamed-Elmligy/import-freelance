import { HttpInterceptorFn } from '@angular/common/http';
import { authInterceptor } from './layers/auth.interceptor';
import { httpInterceptor } from './layers/http.interceptor';
import { errorInterceptor } from './layers/error.interceptor';
import { spinnerInterceptor } from './layers/spinner.interceptor';

export const interceptors: HttpInterceptorFn[] = [
  httpInterceptor,
  authInterceptor,
  errorInterceptor,
  // spinnerInterceptor,
];
