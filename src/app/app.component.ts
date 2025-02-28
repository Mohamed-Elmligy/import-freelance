import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from './modules/shared/services/languages.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  template: `
    <div class="min-h-screen min-w-full" [dir]="languageService.layoutDir()">
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
