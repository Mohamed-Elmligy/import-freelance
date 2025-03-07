import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { main_routes_paths } from '../../main.routes';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-items-category',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    FileUpload,
    ToastModule,

    FileUpload,
    ButtonModule,
    BadgeModule,
    ProgressBar,
    ToastModule,
    HttpClientModule,
  ],
  templateUrl: './items-category.component.html',
  styles: ``,
  providers: [MessageService],
})
export default class ItemsCategoryComponent {
  items: MenuItem[] | undefined;
  mainPaths = main_routes_paths;
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    file: [null, [Validators.required]],
  });

  files = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;

  constructor(private config: PrimeNG) {}

  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: any,
    removeFileCallback: any,
    index: any
  ) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000,
    });
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: any) {
    callback();
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
  submit(form: FormGroup) {
    console.log(form.value);
  }

  reset(form: FormGroup) {
    form.reset();
  }
  ngOnInit() {
    this.items = [
      {
        icon: 'pi  pi-objects-column',
        route: this.mainPaths.itemsCategoryList,
        queryParams: { type: 'itemsCategory' },
      },
      { label: 'itemsCategory', route: this.mainPaths.itemsCategory },
    ];
  }
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
