import { Component, inject, viewChild } from '@angular/core';
import {SidebarComponent} from '../../modules/shared/ui/sidebar/sidebar.component';
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
  styles: `
  
   /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  /* Track */
  ::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 3px;
  }
  
  `,
  templateUrl: './main-layout.component.html',
})
export default class MainLayoutComponent {
  readonly drawerRef = viewChild.required<Drawer>('drawerRef');
  languageService = inject(LanguagesService);

  visible: boolean = false;

  closeCallback(e: any): void {
    this.drawerRef().close(e);
  }
}
