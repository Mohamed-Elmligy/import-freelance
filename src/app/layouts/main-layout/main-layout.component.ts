import { Component, inject, ViewChild } from '@angular/core';
import SidebarComponent from '../../modules/shared/ui/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Drawer } from 'primeng/drawer';
import { LanguagesService } from '../../modules/shared/services/languages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    CommonModule,
  ],
  templateUrl: './main-layout.component.html',
})
export default class MainLayoutComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;
  languageService = inject(LanguagesService);

  visible: boolean = false;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }
}
