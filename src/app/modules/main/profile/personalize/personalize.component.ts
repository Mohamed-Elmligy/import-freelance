import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FloatLabel } from 'primeng/floatlabel';
import { LanguagesService } from '../../../shared/services/languages.service';
import LoginComponent from '../../../auth/login/login.component';

@Component({
  selector: 'app-personalize',
  imports: [
    FormsModule,
    SelectModule,
    ButtonModule,
    CommonModule,
    TranslateModule,
    FloatLabel,
  ],
  templateUrl: './personalize.component.html',
  styles: ``,
})
export class PersonalizeComponent implements OnInit {
  languagesList: any[] | undefined;
  selectedLanguage: any;
  languageService = inject(LanguagesService);
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
