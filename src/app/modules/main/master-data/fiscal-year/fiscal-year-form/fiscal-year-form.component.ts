import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { LookupsService } from '../../../../shared/services/lookups.service';
import { main_routes_paths } from '../../../main.routes';
import { FiscalYearService } from '../fiscal-year.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Tag } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-fiscal-year-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePicker,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    TextareaModule,
    TranslateModule,
    ButtonModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    Tag,
    PageHeaderComponent,
  ],
  templateUrl: './fiscal-year-form.component.html',
})
export default class FiscalYearFormComponent {
  mainPaths = main_routes_paths;

  route: MenuItem[] = [];
  listOfCustomers = signal([]);

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private yearService = inject(FiscalYearService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  yearId = this.activatedRoute.snapshot.queryParams['yearId'];

  yearData: {
    name: string;
    country: string;
    from_date: string;
    to_date: string;
    is_active: boolean;
  } = {
    name: '',
    country: '',
    from_date: '',
    to_date: '',
    is_active: false,
  };

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    country: [null, []],
    from_date: [null, [Validators.required]],
    to_date: [null, [Validators.required]],
    is_active: [false],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.yearService.createYear(form);
      else this.yearService.updateYear(form, this.yearId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }

  ngOnInit() {
    this.route = [
      {
        icon: 'pi pi-calendar-clock',
        route: this.mainPaths.yearList,
      },
      { label: 'year', route: this.mainPaths.year },
    ];
    if (this.yearId && !this.isUpdate) this.getYearById();
    if (this.yearId && this.isUpdate) this.updateYear();
  }

  getYearById() {
    this.yearService.getYearById(this.yearId).subscribe((data: any) => {
      this.yearData = data;
    });
  }
  updateYear() {
    if (this.isUpdate) {
      this.yearService.getYearById(this.yearId).subscribe((data) => {
        this.yearService.apiModelToComponentModel(this.form, data);
      });
    }
  }
}
