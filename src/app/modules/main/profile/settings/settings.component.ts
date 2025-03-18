import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import ResetPasswordComponent from '../reset-password/reset-password.component';
import ProfileSettingsComponent from '../profile-settings/profile-settings.component';
import { PersonalizeComponent } from '../personalize/personalize.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersListComponent } from '../user/users-list/users-list.component';
import { TabService } from '../../../../services/tab.service';

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
export default class SettingsComponent implements OnInit {
  activeTab: any = '0';
  private tabService = inject(TabService);
  ngOnInit(): void {
    this.activeTab = this.tabService.getLastActiveTab()?.toString() || '0';
  }

  onTabChange(event: any): void {
    this.tabService.setLastActiveTab(event);
  }
}
