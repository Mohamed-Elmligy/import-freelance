import { Component, effect, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table'; // Added PrimeNG Table module
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { FiscalYearService } from '../fiscal-year.service';
import { Skeleton } from 'primeng/skeleton';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-fiscal-year-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    DatePickerModule,
    TooltipModule,
    TableModule,
    Skeleton,
    TagModule,
    ReactiveFormsModule,
    SelectButtonModule,
  ],
  templateUrl: './fiscal-year-list.component.html',
})
export default class FiscalYearListComponent {
  languageService = inject(LanguagesService);
  YearService = inject(FiscalYearService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  dataSource: any[] = []; // Changed to array for PrimeNG table
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = false; // Add loading state
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  page: number = 1;
  stateOptions: any[] = [
    {
      label: this.languageService.layoutDir() == 'ltr' ? 'active' : 'نشط',
      value: 'active',
    },
    {
      label: this.languageService.layoutDir() == 'ltr' ? 'inactive' : 'غير نشط',
      value: 'in_active',
    },
  ];

  filterForm: FormGroup = this.formBuilder.group({
    name: [''],
    country: [''],
    is_active: [''],
  });

  constructor() {
    effect(() => {
      this.YearService.yearDeleted();
      this.getYearList();
      this.YearService.yearDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    this.getYearList(this.first + 1, this.rows, filterData);
  }

  getYearList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true; // Set loading state to true
    this.YearService.getList(page, size, filterData).subscribe((data: any) => {
      this.tableColumns = this.YearService.yearHeaders;
      this.displayedColumns = this.YearService.yearHeaders;
      this.dataSource = this.YearService.apiModelToComponentModelList(
        data.results
      );
      this.totalRecords = data.count;
      this.isLoading = false; // Set loading state to false
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.first / event.rows + 1;
    this.getYearList(this.page, event.rows);
  }

  editYear(yearId: any) {
    this.router.navigate([`/${main_routes_paths.year}`], {
      queryParams: { yearId: yearId, edit: true },
    });
  }
  deleteYear(id: string) {
    this.YearService.deleteYear(id);
  }
  viewYear(yearId: string) {
    this.router.navigate([`/${main_routes_paths.year}`], {
      queryParams: { yearId: yearId, edit: false },
    });
  }
}
