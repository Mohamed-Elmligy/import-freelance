import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  private translate = inject(TranslateService);
  // defaultLanguage = signal<string>(this.translate.getBrowserLang() || 'ar');
  defaultLanguage = signal<string>('ar');
  layoutDir = signal<any>(this.defaultLanguage() == 'en' ? 'ltr' : 'rtl');
  initLanguage() {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setDefaultLang('ar');
    this.translate.use(this.defaultLanguage());
  }

  changeLanguage(type: string) {
    if (type == 'en') {
      this.layoutDir.set('ltr');
      this.defaultLanguage.set(type);
      this.translate.use(type);
    } else {
      this.layoutDir.set('rtl');
      this.defaultLanguage.set(type);
      this.translate.use(type);
    }
  }
}
