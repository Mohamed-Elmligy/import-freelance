import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import ResetPasswordComponent from '../reset-password/reset-password.component';
import ProfileSettingsComponent from '../profile-settings/profile-settings.component';
@Component({
  selector: 'app-settings',
  imports: [
    TabsModule,
    CommonModule,
    ResetPasswordComponent,
    ProfileSettingsComponent,
  ],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent {
  ngOnInit() {}
}
