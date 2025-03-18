import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../../../core/services/api.service';
import { PROFILE_APIS } from '../../profile.apis';
import { ShowMessageService } from '../../../../../core/services/show-message.service';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { MenuItem } from 'primeng/api';
import { main_routes_paths } from '../../../main.routes';

@Component({
  selector: 'app-user-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    PasswordModule,
  ],
  templateUrl: './user-form.component.html',
  styles: ``,
})
export default class UserFormComponent implements OnInit {
  private apiService = inject(ApiService);
  private activeRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private showMessageService = inject(ShowMessageService);
  user_id = this.activeRoute.snapshot.queryParams['userId'];
  isUpdate = this.activeRoute.snapshot.queryParams['edit'];
  items: MenuItem[] | undefined;
  mainPaths = main_routes_paths;
  userTypes = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  userForm = this.formBuilder.group({
    first_name: [null, [Validators.required]],
    last_name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    username: [null, [Validators.required]],
    user_type: [null, [Validators.required]],
    fiscal_year: [null, [Validators.required]],
    password: [null],
  });

  ngOnInit(): void {
    this.items = [
      {
        icon: 'pi pi-users',
        route: this.mainPaths.settings,
        queryParams: { type: 'settings' },
      },
      { label: 'settings', route: this.mainPaths.settings },
    ];
    if (this.isUpdate == 'true') {
      this.apiService
        .getDataFromServer(PROFILE_APIS.USER_DETAILS(this.user_id))
        .subscribe((res) => {
          this.userForm.patchValue(res);
        });
    }
  }

  submitForm(): void {
    if (this.isUpdate == 'true') {
      this.apiService
        .updateDataOnServer(
          'put',
          PROFILE_APIS.USER_UPDATE(this.user_id),
          this.userForm.value
        )
        .subscribe((res) => {
          this.showMessageService.showMessage(
            'success',
            'Success',
            'User updated successfully'
          );
        });
    } else {
      this.apiService
        .sendDataToServer(PROFILE_APIS.CREATE_USER(), this.userForm.value)
        .subscribe((res) => {
          this.showMessageService.showMessage(
            'success',
            'Success',
            'User created successfully'
          );
        });
    }
  }

  resetForm(): void {
    this.userForm.reset();
  }
}
