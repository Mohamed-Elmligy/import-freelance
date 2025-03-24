import { Component, inject, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { auth_routes_paths } from '../auth.routes';
import { main_routes_paths } from '../../main/main.routes';
import { _, TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { API_AUTH } from '../auth.api';
import { ApiService } from '../../../core/services/api.service';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MessageModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
})
export default class LoginComponent implements OnInit {
  protected auth_routes = auth_routes_paths;
  protected main_routes = main_routes_paths;
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private browserStorage = inject(BrowserStorageService);
  apis = API_AUTH;
  protected form = this.formBuilder.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit() {
    this.browserStorage.clear('local');
  }

  submit(form: FormGroup) {
    this.apiService.sendDataToServer(this.apis.LOGIN, form.value).subscribe({
      next: (response) => {
        this.router.navigate([this.main_routes.home]);
        this.browserStorage.set('local', 'jwtToken', response);
      },
    });
  }
}
