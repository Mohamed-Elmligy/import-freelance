import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from './modules/shared/services/languages.service';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, Toast],
  template: `
    <div class="min-h-screen min-w-full" [dir]="languageService.layoutDir()">
      <p-toast />
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  title = 'import_project';
  languageService = inject(LanguagesService);
  ngOnInit() {
    this.languageService.initLanguage();
  }
}
