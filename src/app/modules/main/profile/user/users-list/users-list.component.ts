import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, inject, OnInit, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { main_routes_paths } from '../../../main.routes';
import { ApiService } from '../../../../../core/services/api.service';
import { PROFILE_APIS } from '../../profile.apis';
import { Dialog } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ShowMessageService } from '../../../../../core/services/show-message.service';
import { ConfirmSaveDeleteService } from '../../../../../core/services/confirm-save-delete.service';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LanguagesService } from '../../../../shared/services/languages.service';

@Component({
  selector: 'app-users-list',
  imports: [
    ButtonModule,
    RouterModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    Dialog,
    ReactiveFormsModule,
    PasswordModule,
    SkeletonModule,
    ReactiveFormsModule,
    SelectButtonModule,
  ],
  templateUrl: './users-list.component.html',
})
export default class UsersListComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private showMessageService = inject(ShowMessageService);
  private confirmService = inject(ConfirmSaveDeleteService);
  private languageService = inject(LanguagesService);

  visible: boolean = false;
  userId: string = '';

  dataSource: any[] = [];
  tableColumns: string[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  usersList: any[] = [];
  isLoading: boolean = false;
  page: number = 1;

  form = this.formBuilder.group({
    new_password: ['', [Validators.required]],
    confirm_password: ['', [Validators.required]],
  });

  filterForm: FormGroup = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    userType: [''],
  });

  stateOptions: any[] = [
    {
      label: this.languageService.layoutDir() == 'ltr' ? 'admin' : 'ادمن',
      value: 'admin',
    },
    {
      label: this.languageService.layoutDir() == 'ltr' ? 'user' : 'غير ادمن',
      value: 'user',
    },
  ];

  ngOnInit(): void {
    this.usersList = ['first_name', 'last_name', 'email', 'user_type'];
    this.getUsersList();
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    this.getUsersList(this.first + 1, this.rows, filterData);
  }

  getUsersList(page = 1, size = 10, filter?: any) {
    this.isLoading = true;
    this.apiService
      .getDataFromServer(PROFILE_APIS.GET_USERS_LIST, { page, size }, filter)
      .subscribe((data: any) => {
        this.tableColumns = this.usersList;
        this.dataSource = data.results;
        this.totalRecords = data.count;
        this.isLoading = false;
      });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.first / event.rows + 1;
    this.getUsersList(this.page, event.rows);
  }

  createUser() {
    this.router.navigate([`/${main_routes_paths.userForm}`], {
      queryParams: { edit: false },
    });
  }

  editUser(userId: any) {
    this.router.navigate([`/${main_routes_paths.userForm}`], {
      queryParams: { userId: userId, edit: true },
    });
  }

  deleteUser(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this user?',
      () => {
        this.deleteUserApi(id);
      }
    );
  }

  deleteUserApi(id: string) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this user?',
      () => {
        this.apiService
          .deleteDataOnServer(PROFILE_APIS.USER_DELETE(id))
          .subscribe({
            next: () => {
              this.showMessageService.showMessage(
                'success',
                'User Deleted',
                'User has been deleted successfully'
              );
              this.getUsersList();
            },
          });
      }
    );
  }

  viewUser(userId: string) {
    this.router.navigate([`/${main_routes_paths.userData}`], {
      queryParams: { userId: userId },
    });
  }

  showDialog(userId: string) {
    this.visible = true;
    this.userId = userId;
  }

  onSubmit() {
    this.apiService
      .updateDataOnServer(
        'patch',
        PROFILE_APIS.USER_RESET_PASSWORD(this.userId),
        this.form.value
      )
      .subscribe(() => {
        this.visible = false;
        this.showMessageService.showMessage(
          'success',
          'Password Reset',
          'Password has been reset successfully'
        );
      });
  }
}
