import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../../../services/spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.show();
  console.log(spinnerService.isLoading());

  return next(req).pipe(finalize(() => spinnerService.hide()));
};
