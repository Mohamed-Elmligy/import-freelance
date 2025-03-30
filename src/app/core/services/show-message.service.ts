import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ShowMessageService {
  private messageService = inject(MessageService);

  showMessage(type: string, summary: string, detail: string) {
    this.messageService.add({
      severity: type,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  }
}
