import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { auth_routes_paths } from '../auth.routes';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';
import { ShowMessageService } from '../../../core/services/show-message.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    MessageModule
],
  templateUrl: './forget-password.component.html',
})
export default class ForgetPasswordComponent {
  protected ROUTES = auth_routes_paths;
  private formBuilder = inject(FormBuilder);
  private storage = inject(BrowserStorageService);
  private router = inject(Router);
  private showMessageService = inject(ShowMessageService);
  private http = inject(HttpClient);
  access = this.storage.get('local', 'access');

  protected form = this.formBuilder.group({
    new_password: [null, [Validators.required, Validators.minLength(8)]],
    confirm_password: [null, [Validators.required, Validators.minLength(8)]],
  });

  submit(form: FormGroup) {
    if (this.isFormInvalid(form)) return;
    if (this.arePasswordsMismatched(form)) return;

    const payload = this.createPayload(form);
    const headers = this.createHeaders();

    this.sendPasswordResetRequest(payload, headers);
  }

  private isFormInvalid(form: FormGroup): boolean {
    if (form.invalid) {
      this.showMessageService.showMessage(
        'error',
        'Error',
        'Please enter a valid password'
      );
      return true;
    }
    return false;
  }

  private arePasswordsMismatched(form: FormGroup): boolean {
    if (form.value.new_password !== form.value.confirm_password) {
      this.showMessageService.showMessage(
        'error',
        'Error',
        'Passwords do not match'
      );
      return true;
    }
    return false;
  }

  private createPayload(form: FormGroup) {
    return { ...form.value };
  }

  private createHeaders() {
    return {
      Authorization: `Bearer ${this.access}`,
    };
  }

  private sendPasswordResetRequest(payload: any, headers: any) {
    this.http
      .post('account/forget-password/change', payload, {
        headers,
      })
      .subscribe({
        next: (res) => {
          this.showMessageService.showMessage(
            'success',
            'Success',
            'Password reset successfully'
          );
          this.router.navigate([this.ROUTES.LOGIN]);
        },
        error: (error) => {
          console.error('Error:', error);
          this.showMessageService.showMessage(
            'error',
            'Error',
            'Failed to reset password'
          );
        },
      });
  }
}
