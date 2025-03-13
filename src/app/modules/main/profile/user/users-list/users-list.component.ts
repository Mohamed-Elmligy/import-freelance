import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ApiService } from '../../../../../core/services/api.service';
import { PROFILE_APIS } from '../../profile.apis';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserDataComponent } from '../user-data/user-data.component';

@Component({
  selector: 'app-users-list',
  imports: [
    ButtonModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
  ],
  templateUrl: './users-list.component.html',
  styles: ``,
})
export class UsersListComponent implements OnInit {
  apiService = inject(ApiService);
  private router = inject(Router);
  securityService = inject(SecurityService);
  languageService = inject(LanguagesService);
  private dialogService = inject(DialogService);
  private _liveAnnouncer = inject(LiveAnnouncer);

  ref: DynamicDialogRef | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<any>;

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  usersList: any[] = [];

  ngOnInit(): void {
    this.usersList = [
      'first_name',
      'last_name',
      'email',
      'user_type',
      'actions',
    ];
    this.getUsersList();
  }

  getUsersList() {
    this.apiService
      .getDataFromServer(PROFILE_APIS.GET_USERS_LIST)
      .subscribe((data: any) => {
        this.tableColumns = this.usersList;
        this.displayedColumns = this.usersList;
        this.dataSource = new MatTableDataSource<any>(data.results);
        this.resultsLength = data.count;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  editUser(customerId: any) {
    this.router.navigate([`/${main_routes_paths.customers}`], {
      queryParams: { customerId: customerId, edit: true },
    });
  }

  deleteUser(id: string) {
    this.apiService
      .deleteDataOnServer(PROFILE_APIS.GET_USER_DETAILS(id))
      .subscribe(() => {
        this.getUsersList();
      });
  }
  viewUser(customerId: string) {
    console.log('Opening dialog for customerId:', customerId);

    // Check if the dialog is already open
    if (this.ref) {
      console.log('Closing existing dialog');
      this.ref.close();
    }

    this.ref = this.dialogService.open(UserDataComponent, {
      data: { customerId: customerId },
      header: 'User Data',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
    });

    this.ref.onClose.subscribe(() => {
      console.log('Dialog closed');
      this.ref = undefined;
    });
  }
}
