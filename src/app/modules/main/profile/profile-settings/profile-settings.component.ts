import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { TabService } from '../../../../services/tab.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    FileUploadModule,
    ToastModule,
  ],
  templateUrl: './profile-settings.component.html',
  providers: [MessageService],
})
export default class ProfileSettingsComponent {
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  private tabService = inject(TabService);

  uploadedLogo: any = null; // Stores the uploaded logo file
  uploadedCoverImage: any = null; // Stores the uploaded cover image file

  // Initialize the form with validation
  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    logo: [null, [Validators.required]],
    coverImage: [null, [Validators.required]],
  });

  // Handle logo file selection
  onLogoSelect(event: any) {
    this.uploadedLogo = event.files[0];
    this.form.patchValue({ logo: this.uploadedLogo });
    this.messageService.add({
      severity: 'info',
      summary: 'Logo Selected',
      detail: this.uploadedLogo.name,
    });
  }

  // Handle logo file clear
  onLogoClear() {
    this.uploadedLogo = null;
    this.form.patchValue({ logo: null });
    this.messageService.add({
      severity: 'warn',
      summary: 'Logo Cleared',
      detail: '',
    });
  }

  // Handle cover image file selection
  onCoverImageSelect(event: any) {
    this.uploadedCoverImage = event.files[0];
    this.form.patchValue({ coverImage: this.uploadedCoverImage });
    this.messageService.add({
      severity: 'info',
      summary: 'Cover Image Selected',
      detail: this.uploadedCoverImage.name,
    });
  }

  // Handle cover image file clear
  onCoverImageClear() {
    this.uploadedCoverImage = null;
    this.form.patchValue({ coverImage: null });
    this.messageService.add({
      severity: 'warn',
      summary: 'Cover Image Cleared',
      detail: '',
    });
  }

  // Form submission
  submit(form: FormGroup) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('phone', form.value.phone);
      if (this.uploadedLogo) {
        formData.append('logo', this.uploadedLogo);
      }
      if (this.uploadedCoverImage) {
        formData.append('coverImage', this.uploadedCoverImage);
      }

      // Call your API to create the company
      console.log('Form Data:', formData);

      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Company created successfully!',
      });
    } else {
      // Show error message if form is invalid
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all required fields.',
      });
    }
  }
}