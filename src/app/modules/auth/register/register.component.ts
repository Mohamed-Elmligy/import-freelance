import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { auth_routes_paths } from '../auth.routes';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../core/services/api.service';
import { Toast } from 'primeng/toast';
import { API_AUTH } from '../auth.api';

@Component({
  selector: 'app-register',
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MessageModule,
    Toast,
  ],
  templateUrl: './register.component.html',
  providers: [MessageService],
})
export default class RegisterComponent {
  protected ROUTES = auth_routes_paths;
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  protected auth_routes = auth_routes_paths;
  apis = API_AUTH;

  protected form = this.formBuilder.group({
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    confirm_password: [null, [Validators.required, Validators.minLength(8)]],
  });

  submit(form: FormGroup) {
    const ModifideForm = {
      username: form.value.email,
      email: form.value.email,
      password: form.value.password,
      password2: form.value.confirm_password,
      first_name: form.value.firstName,
      last_name: form.value.lastName,
    };
    this.apiService
      .sendDataToServer(this.apis.REGISTER, ModifideForm)
      .subscribe({
        next: (respone) => {
          this.showMessage(
            'success',
            'Success',
            'New user created successfully!'
          );
          this.router.navigate([this.auth_routes.LOGIN]);
        },
        error: (error) => {
          this.showMessage('error', 'Error', error.error.detail);
        },
      });
  }

  showMessage(type: string, summary: string, msg: string) {
    this.messageService.add({
      severity: type,
      summary: summary,
      detail: msg,
    });
  }
}
