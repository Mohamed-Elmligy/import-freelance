import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from './modules/shared/services/languages.service';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, Toast, ConfirmDialog],
  template: `
    <div class="min-h-screen min-w-full" [dir]="languageService.layoutDir()">
      <p-toast [position]="tostDir" />
      <p-confirmdialog />
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
    this.tostDir =
      this.languageService.layoutDir() == 'rtl' ? 'top-left' : 'top-right';
  }
}
