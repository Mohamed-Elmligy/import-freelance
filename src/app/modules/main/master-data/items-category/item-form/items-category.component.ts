
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { main_routes_paths } from '../../../main.routes';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ItemsCategoryService } from '../items-category.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
@Component({
  selector: 'app-items-category',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    ToastModule,
    ButtonModule,
    BadgeModule,
    ToastModule,
    PageHeaderComponent
],
  templateUrl: './items-category.component.html',
  styles: ``,
  providers: [MessageService],
})
export default class ItemsCategoryComponent {
  mainPaths = main_routes_paths;

  route: MenuItem[] = [];

  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private itemService = inject(ItemsCategoryService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  itemId = this.activatedRoute.snapshot.queryParams['itemId'];

  itemData: {
    name: string;
    description: string;
  } = {
    name: '',
    description: '',
  };

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    description: [null, []],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.itemService.createItem(form);
      else this.itemService.updateItem(form, this.itemId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }

  ngOnInit() {
    this.route = [
      {
        icon: 'pi pi-dollar',
        route: this.mainPaths.itemsCategoryList,
      },
      { label: 'item', route: this.mainPaths.itemsCategory },
    ];
    if (this.itemId && !this.isUpdate) this.getItemById();
    if (this.itemId && this.isUpdate) this.updateItem();
  }

  getItemById() {
    this.itemService.getItemById(this.itemId).subscribe((data: any) => {
      this.itemData = data;
    });
  }
  updateItem() {
    if (this.isUpdate) {
      this.itemService.getItemById(this.itemId).subscribe((data) => {
        this.itemService.apiModelToComponentModel(this.form, data);
      });
    }
  }
}
