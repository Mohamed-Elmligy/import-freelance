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
import { PaginationService } from '../../../../../core/services/pagination.service';

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
  private paginationService = inject(PaginationService);

  dataSource: any[] = []; // Changed to array for PrimeNG table
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = false; // Add loading state
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }
  stateOptions: any[] = [
    {
      label: this.languageService.layoutDir() == 'ltr' ? 'active' : 'نشط',
      value: 'True',
    },
    {
      label: this.languageService.layoutDir() == 'ltr' ? 'inactive' : 'غير نشط',
      value: 'False',
    },
  ];

  filterForm: FormGroup = this.formBuilder.group({
    year_name: [''],
    is_active: [''],
  });

  constructor() {
    // Initialize pagination for this component
    this.paginationService.initializeForComponent();
    // Load initial data
    this.getYearList();
    
    effect(() => {
      this.YearService.yearDeleted();
      this.getYearList();
      this.YearService.yearDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getYearList(this.page, this.rows, filterData);
  }

  getYearList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true; // Set loading state to true
    this.YearService.getList(page, size, filterData).subscribe((data: any) => {
      this.tableColumns = this.YearService.yearHeaders;
      this.displayedColumns = this.YearService.yearHeaders;
      this.dataSource = this.YearService.apiModelToComponentModelList(
        data.results
      );
      // Set total records for pagination using the service
      this.paginationService.setTotalRecords(data.count || 0);
      this.isLoading = false; // Set loading state to false
    });
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.getRawValue();
    this.getYearList(paginationState.page, paginationState.rows, filterData);
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
