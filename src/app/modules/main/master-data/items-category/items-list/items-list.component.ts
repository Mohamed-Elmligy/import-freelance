import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
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
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ItemsCategoryService } from '../items-category.service';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-items-list',
  imports: [
    ButtonModule,
    RouterModule,
    TableModule, // Added PrimeNG TableModule
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    Toolbar,
    Skeleton,
    ReactiveFormsModule,
  ],
  templateUrl: './items-list.component.html',
})
export default class ItemsListComponent {
  languageService = inject(LanguagesService);
  ItemsCategoryService = inject(ItemsCategoryService);
  securityService = inject(SecurityService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  dataSource: any[] = []; // Changed to array for PrimeNG table
  isLoading = true; // Add loading state

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  page: number = 1;
  filterForm: FormGroup = this.formBuilder.group({
    item: [''],
  });

  constructor() {
    effect(() => {
      this.ItemsCategoryService.itemDeleted();
      this.getItemsList();
      this.ItemsCategoryService.itemDeleted.set(false);
    });
  }

  applayFilter() {
    let filterData = this.filterForm.getRawValue();
    this.getItemsList(this.first + 1, this.rows, filterData);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.first / event.rows + 1;
    this.getItemsList(this.page, event.rows);
  }

  getItemsList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true; // Set loading to true before fetching
    this.ItemsCategoryService.getList(page, size, filterData).subscribe(
      (data: any) => {
        this.tableColumns = this.ItemsCategoryService.itemsHeaders;
        this.displayedColumns = this.ItemsCategoryService.itemsHeaders;
        this.dataSource =
          this.ItemsCategoryService.apiModelToComponentModelList(data.results);
        this.totalRecords = data.count;
        this.isLoading = false; // Set loading to false after fetching
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = this.dataSource.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filterValue.trim().toLowerCase())
      )
    );
  }

  announceSortChange(sortState: any) {
    this.dataSource.sort((a, b) => {
      const valueA = a[sortState.active];
      const valueB = b[sortState.active];
      if (valueA < valueB) return sortState.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  edieItem(itemId: any) {
    this.router.navigate([`/${main_routes_paths.itemsCategory}`], {
      queryParams: { itemId: itemId, edit: true },
    });
  }
  deleteItem(id: string) {
    this.ItemsCategoryService.deleteItem(id);
  }
  viewItem(itemId: string) {
    this.router.navigate([`/${main_routes_paths.itemsCategory}`], {
      queryParams: { itemId: itemId, edit: false },
    });
  }
}
