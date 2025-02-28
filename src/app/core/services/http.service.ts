import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';

import { loaderToken } from '../interceptors/layers/loading.interceptor';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private HTTP = inject(HttpClient);

  fetch<T, F extends {}>(
    url: string,
    options?: {
      pagination?: Partial<PageEvent>;
      filter?: F;
      withCustomLoader?: boolean;
    }
  ) {
    return this.HTTP.get<SuccessResponse<T>>(url, {
      params: { ...options?.pagination, ...options?.filter },
      context: new HttpContext().set(loaderToken, options?.withCustomLoader),
    });
  }

  fetchById<T>(
    url: string,
    id: number,
    options?: {
      withCustomLoader?: boolean;
    }
  ) {
    return this.HTTP.get<SuccessResponse<T>>(url + id, {
      context: new HttpContext().set(loaderToken, options?.withCustomLoader),
    });
  }

  fetchFile<F extends {}>(
    url: string,
    options?: {
      filter?: F;
      withCustomLoader?: boolean;
    }
  ) {
    return this.HTTP.get<Blob>(url, {
      params: { ...options?.filter },
      context: new HttpContext().set(loaderToken, options?.withCustomLoader),
      responseType: 'blob' as 'json',
      observe: 'body',
    });
  }

  create<T, R>(
    url: string,
    body: T,
    options?: {
      withCustomLoader?: boolean;
    }
  ) {
    return this.HTTP.post<SuccessResponse<R>>(url, body, {
      context: new HttpContext().set(loaderToken, options?.withCustomLoader),
    });
  }

  update<T, R>(
    method: 'put' | 'patch',
    url: string,
    body: T,
    options?: {
      withCustomLoader?: boolean;
    }
  ) {
    return this.HTTP[method]<SuccessResponse<R>>(url, body, {
      context: new HttpContext().set(loaderToken, options?.withCustomLoader),
    });
  }

  delete<R>(
    url: string,
    id: string,
    options?: {
      withCustomLoader?: boolean;
    }
  ) {
    return this.HTTP.delete<SuccessResponse<R>>(url + id, {
      context: new HttpContext().set(loaderToken, options?.withCustomLoader),
    });
  }
}

export type SuccessResponse<T> = {
  status: number;
  message: number;
  details: T;
};

export type ErrorResponse = {
  status: number;
  message: string;
  details: unknown;
};
