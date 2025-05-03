import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  private translate = inject(TranslateService);
  private apiService = inject(ApiService);

  defaultLanguage = signal<string>('ar');
  tostDir = signal<any>(
    this.defaultLanguage() == 'en' ? 'top-right' : 'top-left'
  );

  layoutDir = signal<any>(this.defaultLanguage() == 'en' ? 'ltr' : 'rtl');

  initLanguage() {
    this.translate.addLangs(['ar', 'en']);

    this.translate.setDefaultLang('ar');

    this.translate.use(this.defaultLanguage());
  }

  changeLanguage(language: string) {
    const direction = language === 'en' ? 'ltr' : 'rtl';

    this.layoutDir.set(direction);
    this.defaultLanguage.set(language);
    this.translate.use(language);
  }
  getDefaultLanguage() {
    this.apiService.getDataFromServer('account/preference').subscribe((res) => {
      this.defaultLanguage.set(res.language);
      this.translate.use(res.language);
      this.layoutDir.set(res.language === 'en' ? 'ltr' : 'rtl');
    });
  }

  updateLanguage() {
    const language = this.defaultLanguage();
    this.apiService
      .updateDataOnServer('patch', 'account/preference', {
        language: language,
      })
      .subscribe((res) => {
        this.defaultLanguage.set(language);
        this.translate.use(language);
        this.layoutDir.set(language === 'en' ? 'ltr' : 'rtl');
      });
  }
}
