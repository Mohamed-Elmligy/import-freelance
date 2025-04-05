import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../../../../core/services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PROFILE_APIS } from '../../profile.apis';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { main_routes_paths } from '../../../main.routes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-data',
  imports: [TranslateModule, BreadcrumbModule, RouterModule, CommonModule],
  templateUrl: './user-data.component.html',
})
export default class UserDataComponent {
  private apiService = inject(ApiService);
  private activeRoute = inject(ActivatedRoute);
  user_id = this.activeRoute.snapshot.queryParams['userId'];
  items: MenuItem[] | undefined;
  mainPaths = main_routes_paths;

  userData = {
    userName: '',
    first_name: '',
    email: '',
    last_name: '',
    user_type: '',
  };

  ngOnInit(): void {
    this.items = [
      {
        icon: 'pi pi-users',
        route: this.mainPaths.settings,
        queryParams: { type: 'settings' },
      },
      { label: 'settings', route: this.mainPaths.settings },
    ];
    this.apiService
      .getDataFromServer(PROFILE_APIS.USER_DETAILS(this.user_id))
      .subscribe((data: any) => {
        this.userData = data;
      });
  }
}
