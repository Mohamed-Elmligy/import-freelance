import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { auth_routes_paths } from '../auth.routes';
import { main_routes_paths } from '../../main/main.routes';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  protected auth_routes = auth_routes_paths;
  protected main_routes = main_routes_paths;
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });
  submit(form: FormGroup) {
    console.log(form.value);
  }
}
