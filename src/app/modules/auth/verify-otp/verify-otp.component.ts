import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { auth_routes_paths } from '../auth.routes';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { API_AUTH } from '../auth.api';
import { ShowMessageService } from '../../../core/services/show-message.service';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';
import { LanguagesService } from '../../shared/services/languages.service';

@Component({
  selector: 'app-verify-otp',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputOtpModule,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './verify-otp.component.html',
})
export default class VerifyOtpComponent {
  protected ROUTES = auth_routes_paths;
  private apiService = inject(ApiService);
  private formBuilder = inject(FormBuilder);
  private showMessageService = inject(ShowMessageService);
  private router = inject(Router);
  private storage = inject(BrowserStorageService);
  email = this.storage.get('local', 'email');
  length: number = 6;
  protected form = this.formBuilder.group({
    otp: [null, [Validators.required, Validators.minLength(4)]],
  });
  submit(form: FormGroup) {
    if (form.invalid) console.log('Please enter a valid OTP');

    this.apiService
      .sendDataToServer(API_AUTH.VERIFY_OTP, {
        email: this.email,
        otp: form.value.otp,
      })
      .subscribe((res: any) => {
        this.router.navigate([this.ROUTES.FORGET_PASSWORD]);
        this.showMessageService.showMessage('success', 'Success', res.message);
      });
  }
}
