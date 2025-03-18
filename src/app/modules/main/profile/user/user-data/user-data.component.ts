import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { PROFILE_APIS } from '../../profile.apis';

@Component({
  selector: 'app-user-data',
  imports: [TranslateModule],
  templateUrl: './user-data.component.html',
  styles: ``,
})
export default class UserDataComponent {
  private apiService = inject(ApiService);
  private activeRoute = inject(ActivatedRoute);
  user_id = this.activeRoute.snapshot.queryParams['userId'];

  userData = {
    userName: '',
    first_name: '',
    email: '',
    last_name: '',
    user_type: '',
  };

  ngOnInit(): void {
    this.apiService
      .getDataFromServer(PROFILE_APIS.USER_DETAILS(this.user_id))
      .subscribe((data: any) => {
        this.userData = data;
      });
  }
}
