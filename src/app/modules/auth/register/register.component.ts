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

@Component({
  selector: 'app-register',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {
  protected ROUTES = auth_routes_paths;
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    confirm_password: [null, [Validators.required, Validators.minLength(8)]],
  });
  submit(form: FormGroup) {
    console.log(form.value);
  }
}
