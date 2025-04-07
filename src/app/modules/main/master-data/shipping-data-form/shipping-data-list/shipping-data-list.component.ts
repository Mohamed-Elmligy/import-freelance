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

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading: boolean = true;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  page: number = 1;

  filterForm: FormGroup = this.formBuilder.group({
    name: [''],
    container_sequence: [''],
    port_name: [''],
  });

  constructor() {
    effect(() => {
      this.shippingDataService.shippingDataDeleted();
      this.getShippingList();
      this.shippingDataService.shippingDataDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    this.getShippingList(this.first + 1, this.rows, filterData);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.first / event.rows + 1;
    this.getShippingList(this.page, event.rows);
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
        this.isLoading = false;
      });
  }

  editShipping(shippingId: any) {
    this.router.navigate([`/${main_routes_paths.shippingData}`], {
      queryParams: { shippingId: shippingId, edit: true },
    });
  }

  deleteShipping(id: string) {
    this.shippingDataService.deleteShipping(id);
  }

  viewShipping(shippingId: string) {
    this.router.navigate([`/${main_routes_paths.shippingData}`], {
      queryParams: { shippingId: shippingId, edit: false },
    });
  }
}
