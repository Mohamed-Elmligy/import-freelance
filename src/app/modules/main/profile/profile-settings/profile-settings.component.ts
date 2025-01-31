import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile-settings',
  imports: [FloatLabelModule, InputTextModule, FormsModule],
  templateUrl: './profile-settings.component.html',
})
export default class ProfileSettingsComponent {}
