import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TabService } from '../../../../services/tab.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { ApiService } from '../../../../core/services/api.service';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';
import { PROFILE_APIS } from '../profile.apis';

@Component({
  selector: 'app-reset-password',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './reset-password.component.html',
})
export default class ResetPasswordComponent {
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  private confiermService = inject(ConfirmSaveDeleteService);
  protected form = this.formBuilder.group({
    old_password: [null, [Validators.required, Validators.minLength(8)]],
    new_password: [null, [Validators.required, Validators.minLength(8)]],
    confirm_password: [null, [Validators.required, Validators.minLength(8)]],
  });

  submit(form: FormGroup) {
    if (form.value.new_password !== form.value.confirm_password) {
      this.showMessageService.showMessage(
        'error',
        'Error',
        'Password and confirm password should be same'
      );
      return;
    }

    if (form.valid) {
      this.apiService
        .updateDataOnServer('put', PROFILE_APIS.RESET_PASSWORD, form.value)
        .subscribe((res) => {
          this.showMessageService.showMessage(
            'sucess',
            'Success',
            'Password updated successfully'
          );
        });
    }
  }
}
