import { Component } from '@angular/core';
import SidebarComponent from '../../modules/shared/ui/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
})
export default class MainLayoutComponent {}
