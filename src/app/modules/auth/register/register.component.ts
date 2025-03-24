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
import { ShowMessageService } from '../../../core/services/show-message.service';

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
  private messageService = inject(ShowMessageService);
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
    if (form.invalid) {
      this.messageService.showMessage(
        'error',
        'Error',
        'Please fill out the form correctly.'
      );
      return;
    }

    const modifiedForm = this.createModifiedForm(form.value);
    this.apiService
      .sendDataToServer(this.apis.REGISTER, modifiedForm)
      .subscribe({
        next: () => {
          this.messageService.showMessage(
            'success',
            'Success',
            'New user created successfully!'
          );
          this.router.navigate([this.auth_routes.LOGIN]);
        },
        error: (err) => {
          this.messageService.showMessage(
            'error',
            'Error',
            'Failed to create new user. Please try again.'
          );
        },
      });
  }

  private createModifiedForm(formValue: any) {
    return {
      username: formValue.email,
      email: formValue.email,
      password: formValue.password,
      password2: formValue.confirm_password,
      first_name: formValue.firstName,
      last_name: formValue.lastName,
    };
  }
}
