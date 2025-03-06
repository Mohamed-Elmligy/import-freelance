import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpBackend,
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { interceptors } from './core/interceptors';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { MessageService } from 'primeng/api';

export const MultiTranslateLoader = (
  http: HttpBackend
): MultiTranslateHttpLoader => new MultiTranslateHttpLoader(http, ['i18n/']);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false,
          ripple: true,
        },
      },
    }),
    provideAnimationsAsync(),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: MultiTranslateLoader,
          deps: [HttpBackend],
        },
      }),
    ]),
    provideHttpClient(withInterceptors(interceptors)),
    MessageService,
  ],
};
