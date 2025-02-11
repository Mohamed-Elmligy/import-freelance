import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { auth_routes_paths } from '../auth.routes';
import { TranslateModule } from '@ngx-translate/core';

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
  private formBuilder = inject(FormBuilder);
  protected form = this.formBuilder.group({
    otp: [null, [Validators.required, Validators.minLength(8)]],
  });
  submit(form: FormGroup) {
    console.log(form.value);
  }
}
