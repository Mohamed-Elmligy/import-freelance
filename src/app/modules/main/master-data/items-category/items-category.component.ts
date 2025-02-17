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
  ],
  templateUrl: './items-category.component.html',
  styles: ``,
})
export default class ItemsCategoryComponent {
  items: MenuItem[] | undefined;
  mainPaths = main_routes_paths;
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

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
        route: this.mainPaths.data,
        queryParams: { type: 'itemsCategory' },
      },
      { label: 'itemsCategory', route: this.mainPaths.itemsCategory },
    ];
  }
}
