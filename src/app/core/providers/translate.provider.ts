import { makeEnvironmentProviders } from "@angular/core";
import { HttpBackend } from "@angular/common/http";

import { provideTranslateService, TranslateLoader } from "@ngx-translate/core";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";

export const MultiTranslateLoader = (
  http: HttpBackend
): MultiTranslateHttpLoader => new MultiTranslateHttpLoader(http, ["i18n/"]);

export const provideNgxTranslate = () => {
  return makeEnvironmentProviders([
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: MultiTranslateLoader,
        deps: [HttpBackend],
      },
      defaultLanguage: "ar",
    }),
  ]);
};
