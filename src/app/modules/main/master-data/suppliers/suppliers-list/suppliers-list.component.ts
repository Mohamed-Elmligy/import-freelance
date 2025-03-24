import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
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

@Component({
  selector: 'app-suppliers-list',
  imports: [
    ButtonModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
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
  ],
  templateUrl: './suppliers-list.component.html',
  styles: ``,
})
export default class SuppliersListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  SupplierService = inject(SuppliersService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any[] = [];

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  constructor() {
    effect(() => {
      this.SupplierService.suppliertDeleted();
      this.getSupplierList();
      this.SupplierService.suppliertDeleted.set(false);
    });
  }

  getSupplierList(page: number = 1, size: number = 10) {
    this.SupplierService.getList(page, size).subscribe((data: any) => {
      this.tableColumns = this.SupplierService.SupplierHeaders;
      this.displayedColumns = this.SupplierService.SupplierHeaders;
      this.dataSource = this.SupplierService.apiModelToComponentModelList(
        data.results
      );
      this.resultsLength = data.count;
    });
  }

  loadSuppliers(event: any) {
    const page = event.first / event.rows + 1;
    const size = event.rows;
    this.SupplierService.getList(page, size).subscribe((data: any) => {
      this.dataSource = this.SupplierService.apiModelToComponentModelList(
        data.results
      );
      this.resultsLength = data.count;
    });
  }

  onSort(event: any) {
    const sortField = event.sortField;
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    this.dataSource.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = this.dataSource.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filterValue.trim().toLowerCase())
      )
    );
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
