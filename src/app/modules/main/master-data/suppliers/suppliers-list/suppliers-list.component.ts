import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, effect, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './suppliers-list.component.html',
})
export default class SuppliersListComponent {
  languageService = inject(LanguagesService);
  SupplierService = inject(SuppliersService);
  private router = inject(Router);

  dataSource: any[] = [];

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = false;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor() {
    effect(() => {
      this.SupplierService.suppliertDeleted();
      this.getSupplierList();
      this.SupplierService.suppliertDeleted.set(false);
    });
  }

  getSupplierList(page: number = 1, size: number = 10) {
    this.isLoading = true;
    this.SupplierService.getList(page, size).subscribe(
      (data: any) => {
        this.tableColumns = this.SupplierService.SupplierHeaders;
        this.displayedColumns = this.SupplierService.SupplierHeaders;
        this.dataSource = this.SupplierService.apiModelToComponentModelList(
          data.results
        );
        this.totalRecords = data.count;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.getSupplierList(event.first + 1, event.rows);
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
