import { Component, inject, signal, EnvironmentInjector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from './modules/shared/services/languages.service';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    Toast,
    ConfirmDialog,
    ProgressSpinnerModule,
  ],
  template: `
    <div class="min-h-screen min-w-full" [dir]="languageService.layoutDir()">
      <p-toast [position]="tostDir" />
      <p-confirmdialog />
      <router-outlet />
      @if ( spinnerService.isLoading() ) {
      <p-progress-spinner ariaLabel="loading" class="global-spinner" />
      }
    </div>
  `,
  styles: `
      .global-spinner {
        position: abselute ;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 99999999;
      }
    `,
})
export class AppComponent {
  title = 'shipMaster';
  languageService = inject(LanguagesService);
  tostDir: any;
  constructor(
    public spinnerService: SpinnerService,
    public injector: EnvironmentInjector
  ) {}
  ngOnInit() {
    this.languageService.initLanguage();
    this.tostDir =
      this.languageService.layoutDir() == 'rtl' ? 'top-left' : 'top-right';
  }
}
