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
  invoices,
  itemsCategory,
  officeBalance,
  payments,
  shipmantReport,
  shippingData,
  suppliers,
  totalBalance,
  totalExpenses,
  totalPaids,
  totalPayments,
  transactions,
} from './table.data';
import { MenuItem } from 'primeng/api';
import { ListTableService } from './list-table.service';
import { SecurityService } from '../../../../core/services/security.service';

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
  listService = inject(ListTableService);
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  tableColumns: string[] = [];
  listType = signal<string>('');
  isReport = signal<boolean>(false);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);
  private activateRoute = inject(ActivatedRoute);
  languageService = inject(LanguagesService);
  private router = inject(Router);
  items: MenuItem[] | undefined;
  securityService = inject(SecurityService);
  ngOnInit() {
    console.log(this.securityService.jwtToken);

    this.activateRoute.queryParams.subscribe((param: any) => {
      this.listType.set(param.type);
      if (param.report == 'true') this.isReport.set(true);
      else this.isReport.set(false);
      switch (param.type) {
        case 'customers':
          this.listService.getList('customer').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          // this.displayedColumns = Object.keys(CUSTOMERS[0]);
          // this.dataSource = new MatTableDataSource<any>(CUSTOMERS);
          // this.tableColumns = Object.keys(CUSTOMERS[0]);
          break;
        case 'suppliers':
          this.listService.getList('supplier').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          break;
        case 'itemsCategory':
          this.listService.getList('item').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          break;
        case 'payments':
          this.listService.getList('payments').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          break;
        case 'expenses':
          this.listService.getList('expenses').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          break;
        case 'transactions':
          this.listService.getList('transaction').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          break;
        case 'shippingData':
          this.listService.getList('shippingData').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
          break;
        case 'shipmantReport':
          this.tableColumns = Object.keys(shipmantReport[0]);
          this.displayedColumns = Object.keys(shipmantReport[0]);
          this.dataSource = new MatTableDataSource<any>(shipmantReport);
          break;
        case 'totalPayments':
          this.tableColumns = Object.keys(totalPayments[0]);
          this.displayedColumns = Object.keys(totalPayments[0]);
          this.dataSource = new MatTableDataSource<any>(totalPayments);
          break;
        case 'totalBalance':
          this.tableColumns = Object.keys(totalBalance[0]);
          this.displayedColumns = Object.keys(totalBalance[0]);
          this.dataSource = new MatTableDataSource<any>(totalBalance);
          break;
        case 'totalExpenses':
          this.tableColumns = Object.keys(totalExpenses[0]);
          this.displayedColumns = Object.keys(totalExpenses[0]);
          this.dataSource = new MatTableDataSource<any>(totalExpenses);
          break;
        case 'totalPaids':
          this.tableColumns = Object.keys(totalPaids[0]);
          this.displayedColumns = Object.keys(totalPaids[0]);
          this.dataSource = new MatTableDataSource<any>(totalPaids);
          break;
        case 'officeBalance':
          this.tableColumns = Object.keys(officeBalance[0]);
          this.displayedColumns = Object.keys(officeBalance[0]);
          this.dataSource = new MatTableDataSource<any>(officeBalance);
          break;
        case 'invoices':
          this.listService.getList('invoice').subscribe((data: any) => {
            this.tableColumns = Object.keys(data[0]);
            this.displayedColumns = Object.keys(data[0]);
            this.dataSource = new MatTableDataSource<any>(data);
          });
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

  downloadFile() {
    if (this.listType()) {
    }
  }

  createForm() {
    this.router.navigate([`/main/${this.listType()}`]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
