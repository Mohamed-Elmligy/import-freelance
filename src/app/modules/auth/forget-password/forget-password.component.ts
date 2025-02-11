import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { auth_routes_paths } from '../auth.routes';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './forget-password.component.html',
})
export default class ForgetPasswordComponent {
  protected ROUTES = auth_routes_paths;
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
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
