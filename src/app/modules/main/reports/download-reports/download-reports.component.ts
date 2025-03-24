import { Component, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-download-reports',
  imports: [
    Toolbar,
    ButtonModule,
    InputTextModule,
    Select,
    FloatLabel,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './download-reports.component.html',
})
export default class DownloadReportsComponent {
  selectedReportType: string = '';

  items: MenuItem[] | undefined;

  reportsTypes: City[] | undefined;

  value1: City | undefined;

  value2: City | undefined;

  value3: City | undefined;

  ngOnInit() {
    this.reportsTypes = [
      { name: 'Invoice Details', code: 'invoiceDetails' },
      { name: 'Supplier Report', code: 'supplierReport' },
    ];

    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }
}

interface City {
  name: string;
  code: string;
}
