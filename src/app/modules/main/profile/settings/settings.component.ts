import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import ResetPasswordComponent from '../reset-password/reset-password.component';
import ProfileSettingsComponent from '../profile-settings/profile-settings.component';
import { PersonalizeComponent } from '../personalize/personalize.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersListComponent } from '../user/users-list/users-list.component';
@Component({
  selector: 'app-settings',
  imports: [
    TabsModule,
    CommonModule,
    ResetPasswordComponent,
    ProfileSettingsComponent,
    PersonalizeComponent,
    TranslateModule,
    UsersListComponent,
  ],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent {
  ngOnInit() {}
}
