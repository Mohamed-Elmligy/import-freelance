import { Component, inject, OnInit } from '@angular/core';
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
import { environment } from '../../../../../environments/environment';

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
export default class ProfileSettingsComponent implements OnInit {
  // Inject the required services
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private securityService = inject(SecurityService);

  // Variables to store the uploaded files
  uploadedLogo: any = null; // Stores the uploaded logo file
  uploadedCoverImage: any = null; // Stores the uploaded cover image file
  profileImage: string | ArrayBuffer | null = null;
  coverImage: string | ArrayBuffer | null = null;

  // Variable to store the company status
  companyStatus: boolean = false;

  // Initialize the form with validation
  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    phone: [null, [Validators.required]],
  });

  ngOnInit(): void {
    // Check if the user has already created a company
    this.apiService.getDataFromServer(PROFILE_APIS.GET_COMPANY()).subscribe({
      next: (response) => {
        this.companyStatus = true;
        this.profileImage = response.logo; // Set profile image URL from API response
        this.coverImage = response.cover; // Set cover image URL from API response
        this.form.patchValue(response);
      },
      error: (error) => {
        this.companyStatus = false;
      },
    });
  }

  get retrieveCompanyLogo(): string {
    return this.form.get('logo')?.value ?? '';
  }

  get retrieveCompanyCoverImage(): string {
    return this.form.get('coverImage')?.value ?? '';
  }

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

      if (this.companyStatus) {
        // Call your API to update the company
        this.apiService
          .updateDataOnServer('put', PROFILE_APIS.UPDATE_COMPANY(), formData)
          .subscribe({
            next: (response) => {
              // Redirect to home page
              this.router.navigate(['/main/home']);
            },
            error: (error) => {},
            complete: () => {
              // Show success message
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Company updated successfully!',
              });
            },
          });
      }

      if (!this.companyStatus) {
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
      }
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
