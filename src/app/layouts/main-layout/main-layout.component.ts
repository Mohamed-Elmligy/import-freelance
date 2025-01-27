import { Component, ViewChild } from '@angular/core';
import SidebarComponent from '../../modules/shared/ui/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: './main-layout.component.html',
})
export default class MainLayoutComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  visible: boolean = false;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }
}
