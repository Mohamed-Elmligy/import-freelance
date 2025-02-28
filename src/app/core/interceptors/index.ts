import { HttpInterceptorFn } from "@angular/common/http";

import { internetInterceptor } from "./layers/internet.interceptor";
import { loadingInterceptor } from "./layers/loading.interceptor";
import { errorInterceptor } from "./layers/error.interceptor";
import { authInterceptor } from "./layers/auth.interceptor";
import { httpInterceptor } from "./layers/http.interceptor";

export const interceptors: HttpInterceptorFn[] = [
  internetInterceptor,
  httpInterceptor,
  authInterceptor,
  loadingInterceptor,
  errorInterceptor,
];
