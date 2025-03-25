import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  private translate = inject(TranslateService);

  defaultLanguage = signal<string>('ar');

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
}
