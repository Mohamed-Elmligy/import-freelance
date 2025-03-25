import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmSaveDeleteService {
  private confirmationService = inject(ConfirmationService);

  private confirmAction(
    header: string,
    icon: string,
    acceptLabel: string,
    acceptSeverity: string,
    message: string,
    accept: () => void
  ) {
    this.confirmationService.confirm({
      header: header,
      icon: icon,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: acceptLabel,
        severity: acceptSeverity,
      },
      message: message,
      accept: accept,
    });
  }

  confirmSave(message: string, accept: () => void) {
    this.confirmAction(
      'Confirmation',
      'pi pi-exclamation-triangle',
      'Save',
      'primary',
      message,
      accept
    );
  }

  confirmDelete(message: string, accept: () => void) {
    this.confirmAction(
      'Danger Zone',
      'pi pi-info-circle',
      'Delete',
      'danger',
      message,
      accept
    );
  }
}
