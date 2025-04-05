import { Component, inject, input, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { DialogService } from './dialog.service';
@Component({
  selector: 'app-dialog',
  imports: [Dialog, ButtonModule, InputTextModule, AvatarModule],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  dialogService = inject(DialogService);
  public header = input();
  public content = input.required<any>();
  public footer = input('');
}
