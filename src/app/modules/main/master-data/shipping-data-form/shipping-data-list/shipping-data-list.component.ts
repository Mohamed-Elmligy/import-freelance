import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ShippingDataService } from '../shipping-data.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { UserPermissionService } from '../../../../../services/user-permission.service';
import { PaginationService } from '../../../../../core/services/pagination.service';

@Component({
  selector: 'app-shipping-data-list',
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
  templateUrl: './shipping-data-list.component.html',
})
export default class ShippingDataListComponent {
  languageService = inject(LanguagesService);
  private shippingDataService = inject(ShippingDataService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  userPermissionService = inject(UserPermissionService);
  private paginationService = inject(PaginationService);

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading: boolean = true;
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }

  filterForm: FormGroup = this.formBuilder.group({
    customer_name: [''],
    container_sequence: [''],
    container_number: [''],
    port_name: [''],
  });

  constructor() {
    // Load initial data
    this.getShippingList();
    
    effect(() => {
      this.shippingDataService.shippingDataDeleted();
      this.getShippingList();
      this.shippingDataService.shippingDataDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getShippingList(this.page, this.rows, filterData);
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.getRawValue();
    this.getShippingList(paginationState.page, paginationState.rows, filterData);
  }

  getShippingList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true;
    this.shippingDataService
      .getList(page, size, filterData)
      .subscribe((data: any) => {
        this.tableColumns = this.shippingDataService.ShippingHeaders;
        this.displayedColumns = this.shippingDataService.ShippingHeaders;
        this.dataSource = this.shippingDataService.apiModelToComponentModelList(
          data.results
        );
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
        this.isLoading = false;
      });
  }

  editShipping(shippingId: any) {
    this.router.navigate([`/${main_routes_paths.shippingData}`], {
      queryParams: { shippingId: shippingId, edit: true },
    });
  }

  deleteShipping(id: number) {
    this.shippingDataService.deleteShipping(id);
  }

  viewShipping(shippingId: string) {
    this.router.navigate([`/${main_routes_paths.shippingData}`], {
      queryParams: { shippingId: shippingId, edit: false },
    });
  }
}
