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
import { ApiService } from '../../../../core/services/api.service';
import { PROFILE_APIS } from '../profile.apis';
import { Router } from '@angular/router';
import { SecurityService } from '../../../../core/services/security.service';

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
  private apiService = inject(ApiService);
  private router = inject(Router);
  private securityService = inject(SecurityService);

  uploadedLogo: any = null; // Stores the uploaded logo file
  uploadedCoverImage: any = null; // Stores the uploaded cover image file
  profileImage: string | ArrayBuffer | null = null;
  coverImage: string | ArrayBuffer | null = null;

  // Initialize the form with validation
  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    logo: [null, [Validators.required]],
    coverImage: [null, [Validators.required]],
  });

  // Handle profile image change
  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => (this.profileImage = e.target?.result ?? null);
      let file = input.files[0];
      reader.readAsDataURL(file);
      this.uploadedLogo = file;
    }
  }

  // Handle cover image change
  onCoverImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => (this.coverImage = e.target?.result ?? null);
      let file = input.files[0];
      reader.readAsDataURL(file);
      this.uploadedCoverImage = file;
    }
  }

  // Form submission
  onSubmit(form: FormGroup) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('phone', form.value.phone);
      if (this.uploadedLogo) {
        formData.append('logo', this.uploadedLogo, this.uploadedLogo.name);
      }
      if (this.uploadedCoverImage) {
        formData.append(
          'cover',
          this.uploadedCoverImage,
          this.uploadedCoverImage.name
        );
      }

      // Call your API to create the company
      this.apiService
        .sendDataToServer(PROFILE_APIS.CREATE_COMPANY(), formData)
        .subscribe({
          next: (response) => {
            this.securityService.updateUerCompanyStatus(true);

            // Redirect to home page
            this.router.navigate(['/main/home']);
          },
          error: (error) => {
            console.error('Error creating company!', error);
          },
          complete: () => {
            // Show success message
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Company created successfully!',
            });
          },
        });

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
