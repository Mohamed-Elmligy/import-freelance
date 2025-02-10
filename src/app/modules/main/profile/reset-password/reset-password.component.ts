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
  protected form = this.formBuilder.group({
    current_password: [null, [Validators.required, Validators.minLength(8)]],
    new_password: [null, [Validators.required, Validators.minLength(8)]],
    confirm_new_password: [
      null,
      [Validators.required, Validators.minLength(8)],
    ],
  });
  submit(form: FormGroup) {
    console.log(form.value);
  }
}
