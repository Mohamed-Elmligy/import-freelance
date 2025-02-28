import { inject } from "@angular/core";
import {
  HttpInterceptorFn,
  HttpContextToken,
  HttpEventType,
} from "@angular/common/http";

import { tap } from "rxjs";

import { LayoutService } from "../../services/layout.service";

// NOTE: use this token for every request at which we don't need to global loading.
export const loaderToken = new HttpContextToken(() => false);

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const layoutService = inject(LayoutService);

  if (request.context.get(loaderToken)) return next(request);

  layoutService.isLoading.set(true);

  return next(request).pipe(
    tap(
      (response) =>
        response.type === HttpEventType.Response &&
        layoutService.isLoading.set(false)
    )
  );
};
