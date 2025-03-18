import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ApiService } from '../../../core/services/api.service';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';
import { ShowMessageService } from '../../../core/services/show-message.service';
import { main_routes_paths } from '../../main/main.routes';
import { API_AUTH } from '../auth.api';
import { auth_routes_paths } from '../auth.routes';

@Component({
  selector: 'app-confirm-email',
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    // RouterLink,
    TranslateModule,
    MessageModule,
    CommonModule,
  ],
  templateUrl: './confirm-email.component.html',
  styles: ``,
})
export default class ConfirmEmailComponent {
  protected auth_routes = auth_routes_paths;
  protected main_routes = main_routes_paths;
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  private router = inject(Router);
  private storage = inject(BrowserStorageService);
  apis = API_AUTH;
  protected form = this.formBuilder.group({
    email: [null, [Validators.required]],
  });

  submit(form: FormGroup) {
    this.storage.set('local', 'email', form.value.email);
    this.router.navigate([this.auth_routes.VERIFY_USER]);
    this.apiService
      .sendDataToServer(this.apis.CONFIRM_EMAIL, form.value)
      .subscribe({
        next: (respone) => {
          this.router.navigate([this.auth_routes.VERIFY_USER]);
          this.storage.set('local', 'email', form.value.email);
        },
        error: (error) => {
          console.log(error);

          this.showMessageService.showMessage('error', 'Error', error.error);
        },
      });
  }
}
