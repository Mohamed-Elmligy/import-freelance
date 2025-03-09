import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from './modules/shared/services/languages.service';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, Toast],
  template: `
    <div class="min-h-screen min-w-full" [dir]="languageService.layoutDir()">
      <p-toast [position]="tostDir" />
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  title = 'import_project';
  languageService = inject(LanguagesService);
  tostDir: any;
  ngOnInit() {
    this.languageService.initLanguage();
    this.languageService.layoutDir() == 'rtl'
      ? (this.tostDir = 'top-left')
      : (this.tostDir = 'top-right');
  }
}
