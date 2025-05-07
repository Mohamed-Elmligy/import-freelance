import { Component, inject, OnInit } from '@angular/core';

import { TabsModule } from 'primeng/tabs';
import ResetPasswordComponent from '../reset-password/reset-password.component';
import ProfileSettingsComponent from '../profile-settings/profile-settings.component';
import { PersonalizeComponent } from '../personalize/personalize.component';
import { TranslateModule } from '@ngx-translate/core';
import { TabService } from '../../../../services/tab.service';
import { userIsAdmin } from '../../../../core/guards/no-company-user.guard';

@Component({
  selector: 'app-settings',
  imports: [
    TabsModule,
    ResetPasswordComponent,
    ProfileSettingsComponent,
    PersonalizeComponent,
    TranslateModule,
  ],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  activeTab: any = '0';
  private tabService = inject(TabService);
  userIsAdmin = userIsAdmin();
  ngOnInit(): void {
    if (this.userIsAdmin === 'Admin') {
      this.activeTab = '0';
    } else {
      this.activeTab = '1';
    }
    // this.activeTab = this.tabService.getLastActiveTab()?.toString() || '0';
  }

  onTabChange(event: any): void {
    this.tabService.setLastActiveTab(event);
  }
}
