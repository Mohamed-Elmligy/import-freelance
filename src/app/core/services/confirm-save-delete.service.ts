import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmSaveDeleteService {
  private confirmationService = inject(ConfirmationService);

  confirmSave(message: string, accept: () => void) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      message: message,
      accept: accept,
    });
  }

  confirmDelete(message: string, accept: () => void) {
    this.confirmationService.confirm({
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      message: message,
      accept: accept,
    });
  }
}
