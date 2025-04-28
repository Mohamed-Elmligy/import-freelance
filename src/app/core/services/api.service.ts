import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export enum ProgressStatus {
  progress = 'progress',
  done = 'done',
  unknown = 'unknown',
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private HTTP = inject(HttpClient);
  private messages = inject(MessageService);

  constructor() {}

  getDataFromServer(
    base_url: string,
    pagination?: { page: number | null; count: number | null },
    filter?: any
  ) {
    this.removeInvalidValues(pagination);
    this.removeInvalidValues(filter);
    return this.HTTP.get<any>(base_url, {
      params: { ...pagination, ...filter },
    });
  }

  removeInvalidValues(filter: any) {
    if (filter) {
      for (const key in filter) {
        if (
          filter[key] === null ||
          filter[key] === undefined ||
          filter[key] === '' ||
          (Array.isArray(filter[key]) && filter[key].length === 0) ||
          (typeof filter[key] === 'object' &&
            Object.keys(filter[key]).length === 0)
        ) {
          delete filter[key];
        }
      }
    }
  }

  getDataFromServerById(base_url: string, id: number) {
    return this.HTTP.get(base_url + id);
  }

  sendDataToServer<TBody extends object, TResponse extends object>(
    base_url: string,
    model: TBody,
    id?: string
  ) {
    return this.HTTP.post(id ? base_url + id : base_url, model);
  }

  updateDataOnServer<
    TMethod extends 'put' | 'patch',
    TBody extends object,
    TResponse extends object
  >(method: TMethod, base_url: string, model: TBody, id?: string) {
    return this.HTTP[method](id ? base_url + id : base_url, model);
  }

  deleteDataOnServer(
    base_url: string,
    list?: { [x: string]: number[] } | number[]
  ) {
    return this.HTTP.delete(base_url, { body: list });
  }

  // #region Handling Files
  private getFileFromServer(base_url: string, params?: {}) {
    return this.HTTP.get(base_url, {
      params: { ...params },
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
    });
  }

  private getEventMessage(event: any) {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        const percentDone = Math.round(
          (100 * event.loaded) / (event.total ?? 1)
        );
        return { status: ProgressStatus.progress, message: percentDone };

      case HttpEventType.Response:
        return { status: ProgressStatus.done, message: event.body };

      default:
        return {
          status: ProgressStatus.unknown,
          message: `Unhandled event: ${event.type}`,
        };
    }
  }

  handleDownloadDocument(
    progress: { status: ProgressStatus; message: any },
    fileName: string,
    fileType: 'pdf' | 'xlsx'
  ) {
    if (!progress) return;
    const url = URL.createObjectURL(progress.message as Blob);
    
    if (fileType === 'pdf') {
      // For PDFs, open in new tab
      window.open(url, '_blank');
    } else {
      // For Excel files, download as before
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${fileName}.${fileType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Clean up the URL object
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  downloadFile(URL: string, params?: {}) {
    const requestParams = params
      ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
      : {};
    return this.getFileFromServer(URL, requestParams).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      map((event) => this.getEventMessage(event))
    );
  }
}
