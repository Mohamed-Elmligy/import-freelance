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
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { TabService } from '../../../../services/tab.service';
@Component({
  selector: 'app-profile-settings',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    FileUpload,
    ToastModule,
  ],
  templateUrl: './profile-settings.component.html',
  providers: [MessageService],
})
export default class ProfileSettingsComponent {
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  private tabService = inject(TabService);

  uploadedFiles: any[] = [];

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    logo: [null, [Validators.required]],
    phone: [null, [Validators.required]],
  });

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }
  submit(form: FormGroup) {
    console.log(form.value);
  }
}
