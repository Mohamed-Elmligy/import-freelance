import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { map } from 'rxjs';
import { LookupsService } from '../../../../shared/services/lookups.service';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-user-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    PageHeaderComponent,
    RouterModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    PasswordModule,
    MessageModule,
  ],
  templateUrl: './user-form.component.html',
})
export default class UserFormComponent implements OnInit {
  private apiService = inject(ApiService);
  private activeRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private showMessageService = inject(ShowMessageService);
  private lookupService = inject(LookupsService);
  private location = inject(Location);
  listOfYears = signal([]);
  listOfCustomers = signal([]);

  user_id = this.activeRoute.snapshot.queryParams['userId'];
  isUpdate = this.activeRoute.snapshot.queryParams['edit'];

  route: MenuItem[] | undefined;
  mainPaths = main_routes_paths;

  userTypes = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Customer', value: 'customer' },
  ];

  userForm = this.formBuilder.group({
    first_name: [null, [Validators.required]],
    last_name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    username: [null, [Validators.required]],
    user_type: ['', [Validators.required]],
    fiscal_year: [null],
    password: [null],
    customer: [null],
  });

  ngOnInit(): void {
    if (this.isUpdate == 'true') {
      this.apiService
        .getDataFromServer(PROFILE_APIS.USER_DETAILS(this.user_id))
        .subscribe((res) => {
          this.userForm.patchValue(res);
        });
    } else {
      this.userForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }

    this.route = [
      {
        icon: 'pi pi-dollar',
        route: this.mainPaths.usersList,
      },
      { label: 'userList', route: this.mainPaths.usersList },
    ];

    this.lookupService
      .getListOfLookups('fiscal-years')
      .pipe(
        map((data: any) => {
          this.listOfYears.set(data);
        })
      )
      .subscribe();

    this.lookupService
      .getListOfLookups('customers')
      .pipe(
        map((data: any) => {
          this.listOfCustomers.set(data);
        })
      )
      .subscribe();
  }

  userTypeValidation() {
    if ((this, this.userForm.get('user_type')?.value == 'customer')) {
      this.userForm.get('customer')?.setValidators([Validators.required]);
      this.userForm.get('fiscal_year')?.setValidators([Validators.required]);
      this.userForm.get('customer')?.updateValueAndValidity();
      this.userForm.get('fiscal_year')?.updateValueAndValidity();
    } else {
      this.userForm.get('customer')?.clearValidators();
      this.userForm.get('fiscal_year')?.clearValidators();
      this.userForm.get('customer')?.updateValueAndValidity();
      this.userForm.get('fiscal_year')?.updateValueAndValidity();
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
          this.location.back();
        });
    } else {
      if (this.userForm.valid) {
        this.apiService
          .sendDataToServer(PROFILE_APIS.CREATE_USER(), this.userForm.value)
          .subscribe((res) => {
            this.showMessageService.showMessage(
              'success',
              'Success',
              'User created successfully'
            );
            this.location.back();
          });
      } else {
        this.userForm.markAllAsTouched();
        this.userForm.markAsDirty();
        this.userForm.updateValueAndValidity();
        this.showMessageService.showMessage(
          'error',
          'Error',
          'Please fill all required fields'
        );
      }
    }
  }

  resetForm(): void {
    this.userForm.reset();
  }
}
