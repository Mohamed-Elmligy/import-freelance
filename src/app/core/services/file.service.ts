import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DestroyRef, Injectable, inject } from "@angular/core";

import { HttpService } from "./http.service";

import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import {
  catchError,
  throwError,
  Observable,
  takeWhile,
  switchMap,
  concatMap,
  interval,
  filter,
  map,
} from "rxjs";

// #region Types
type FileExportMeta = {
  exportType: ExportType.DEFAULT | ExportType.SHORT;
  endPoint: string;
  fileName: string;
  extension?: FileExtension.XLSX | FileExtension.PDF | FileExtension.CSV;
  filter?: Record<string, unknown>;
  shortInterval?: number;
};

export enum ExportType {
  DEFAULT = "default",
  SHORT = "shortPoll",
  // TODO: add progress indicator type in future updates
}

export enum FileExtension {
  XLSX = "xlsx",
  CSV = "csv",
  PDF = "pdf",
  // TODO: add more file extensions type in future updates
}

@Injectable({
  providedIn: "root",
})
export class FileService {
  destroyRef = inject(DestroyRef);
  HTTP = inject(HttpService);

  // TODO: remove temporary dependencies & declarations
  messages = inject(MessageService);
  translation = inject(TranslateService);

  // #region Private utilities
  private _exportTypeMap = new Map<
    ExportType,
    (data: FileExportMeta) => Observable<Blob>
  >([
    [ExportType.DEFAULT, (data: FileExportMeta) => this._defaultExport(data)],
    [
      ExportType.SHORT,
      (data: FileExportMeta) =>
        this._shortPollInit(data).pipe(
          concatMap((response) => this._shortPollTracker(response))
        ),
    ],
  ]);

  private _defaultExport(data: FileExportMeta) {
    return this.HTTP.fetchFile(data.endPoint, {
      ...data.filter,
    }).pipe(catchError((error) => throwError(() => error)));
  }

  private _shortPollInit(data: FileExportMeta) {
    return this.HTTP.fetch(data.endPoint, {
      // ...data.filter,
    }).pipe(
      map((response: any) => ({ report_id: response.report_id, data })),
      catchError((error) => throwError(() => error))
    );
  }

  private _shortPollTracker(meta: { report_id: string; data: FileExportMeta }) {
    return interval(meta.data.shortInterval || 1500).pipe(
      switchMap(() => {
        const endPoint = `${meta.data.endPoint}?report_id=${meta.report_id}`;
        return this.HTTP.fetchFile(endPoint);
      }),
      takeWhile((res) => this._isFileNotReady(res), true),
      filter((res) => !this._isFileNotReady(res))
    );
  }

  private _isFileNotReady(response: Blob) {
    return response.type === "application/json";
  }

  private _saveFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.messages.clear();

    this.messages.add({
      severity: "error",
      summary: "Error",
      detail: this.translation.instant("DOWNLOAD_COMPLETE"),
    });
  }

  // #region Public utilities
  _exportFile(data: FileExportMeta) {
    this.messages.add({
      severity: "success",
      summary: "Success",
      detail: this.translation.instant("DOWNLOAD_STARTED"),
    });

    // NOTE: Map access is much faster and clear to be used instead of any further if statements & type safe
    this._exportTypeMap.get(data.exportType)!(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => this._saveFile(response, data.fileName));
  }

  _downloadTemplate(model: string, fileName: string) {
    this.HTTP.fetchFile("")
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => throwError(() => error))
      )
      .subscribe({
        next: (template) => this._saveFile(template, fileName),
      });
  }
}
