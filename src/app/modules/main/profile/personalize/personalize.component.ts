import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FloatLabel } from 'primeng/floatlabel';
import { LanguagesService } from '../../../shared/services/languages.service';
import LoginComponent from '../../../auth/login/login.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserStorageService } from '../../../../core/services/browser-storage.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { TabService } from '../../../../services/tab.service';

@Component({
  selector: 'app-personalize',
  imports: [
    FormsModule,
    SelectModule,
    ButtonModule,
    TranslateModule,
    FloatLabel,
    Toast,
  ],
  templateUrl: './personalize.component.html',
})
export class PersonalizeComponent implements OnInit {
  languagesList: any[] | undefined;
  selectedLanguage: any;
  languageService = inject(LanguagesService);
  showMessageService = inject(ShowMessageService);
  ngOnInit() {
    this.languagesList = [
      { name: 'arabic', code: 'ar', flag: 'https://flagcdn.com/w20/eg.png' },
      {
        name: 'english',
        code: 'en',
        flag: 'https://flagcdn.com/w20/us.png',
      },
    ];
    this.selectedLanguage = this.languagesList.find(
      (lang) => lang.code == this.languageService.defaultLanguage()
    );
  }
  changeLang() {
    this.languageService.changeLanguage(this.selectedLanguage.code);
  }
}
