import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from '../../../shared/services/languages.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToolbarModule } from 'primeng/toolbar';
import { Toolbar } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { DatePickerModule } from 'primeng/datepicker';

import {
  CUSTOMERS,
  expenses,
  itemsCategory,
  payments,
  shippingData,
  suppliers,
  transactions,
} from './table.data';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-data',
  imports: [
    ButtonModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    PanelModule,
    DatePickerModule,
  ],
  templateUrl: './main-data.component.html',
})
export default class MainDataComponent {
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  tableColumns: string[] = [];
  listType = signal<string>('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);
  private activateRoute = inject(ActivatedRoute);
  languageService = inject(LanguagesService);
  private router = inject(Router);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((param: any) => {
      this.listType.set(param.type);
      switch (param.type) {
        case 'customers':
          this.displayedColumns = Object.keys(CUSTOMERS[0]);
          this.dataSource = new MatTableDataSource<any>(CUSTOMERS);
          this.tableColumns = Object.keys(CUSTOMERS[0]);
          break;
        case 'suppliers':
          this.tableColumns = Object.keys(suppliers[0]);
          this.displayedColumns = Object.keys(suppliers[0]);
          this.dataSource = new MatTableDataSource<any>(suppliers);
          break;
        case 'itemsCategory':
          this.tableColumns = Object.keys(itemsCategory[0]);
          this.displayedColumns = Object.keys(itemsCategory[0]);
          this.dataSource = new MatTableDataSource<any>(itemsCategory);
          break;
        case 'payments':
          this.tableColumns = Object.keys(payments[0]);
          this.displayedColumns = Object.keys(payments[0]);
          this.dataSource = new MatTableDataSource<any>(payments);
          break;
        case 'expenses':
          this.tableColumns = Object.keys(expenses[0]);
          this.displayedColumns = Object.keys(expenses[0]);
          this.dataSource = new MatTableDataSource<any>(expenses);
          break;
        case 'transactions':
          this.tableColumns = Object.keys(transactions[0]);
          this.displayedColumns = Object.keys(transactions[0]);
          this.dataSource = new MatTableDataSource<any>(transactions);
          break;
        case 'shippingData':
          this.tableColumns = Object.keys(shippingData[0]);
          this.displayedColumns = Object.keys(shippingData[0]);
          this.dataSource = new MatTableDataSource<any>(shippingData);
          break;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  createForm() {
    this.router.navigate([`/main/${this.listType()}`]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
