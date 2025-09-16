import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, effect, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { SuppliersService } from '../suppliers.service';
import { SkeletonModule } from 'primeng/skeleton';
import { UserPermissionService } from '../../../../../services/user-permission.service';
import { PaginationService } from '../../../../../core/services/pagination.service';

@Component({
  selector: 'app-suppliers-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    TableModule,
    SkeletonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './suppliers-list.component.html',
})
export default class SuppliersListComponent {
  languageService = inject(LanguagesService);
  SupplierService = inject(SuppliersService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  userPermissionService = inject(UserPermissionService);
  private paginationService = inject(PaginationService);

  dataSource: any[] = [];

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = false;
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }

  filterForm: FormGroup = this.formBuilder.group({
    name: [''],
    code: [''],
    store_number: [''],
  });

  constructor() {
    // Load initial data
    this.getSupplierList();
    
    effect(() => {
      this.SupplierService.suppliertDeleted();
      this.getSupplierList();
      this.SupplierService.suppliertDeleted.set(false);
    });
  }

  applayFilter() {
    const filterData = this.filterForm.value;
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getSupplierList(this.page, this.rows, filterData);
  }

  getSupplierList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true;
    this.SupplierService.getList(page, size, filterData).subscribe(
      (data: any) => {
        this.tableColumns = this.SupplierService.SupplierHeaders;
        this.displayedColumns = this.SupplierService.SupplierHeaders;
        this.dataSource = this.SupplierService.apiModelToComponentModelList(
          data.results
        );
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.value;
    this.getSupplierList(paginationState.page, paginationState.rows, filterData);
  }

  editSupplier(supplierId: any) {
    this.router.navigate([`/${main_routes_paths.suppliers}`], {
      queryParams: { supplierId: supplierId, edit: true },
    });
  }
  deleteSupplier(id: string) {
    this.SupplierService.deleteSupplier(id);
  }
  viewSupplier(supplierId: string) {
    this.router.navigate([`/${main_routes_paths.suppliers}`], {
      queryParams: { supplierId: supplierId, edit: false },
    });
  }
}
