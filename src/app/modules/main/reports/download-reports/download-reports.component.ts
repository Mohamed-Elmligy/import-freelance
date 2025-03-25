import { Component, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-download-reports',
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    Select,
    FloatLabel,
    FormsModule,
  ],
  templateUrl: './download-reports.component.html',
})
export default class DownloadReportsComponent {
  reportsTypes: ReportType[] | undefined;

  selectedReport: ReportType | undefined;

  value2: ReportType | undefined;

  value3: ReportType | undefined;

  ngOnInit() {
    this.reportsTypes = [
      { name: 'Invoice Details', code: 'invoiceDetails' },
      { name: 'Supplier Report', code: 'supplierReport' },
    ];
  }
}

interface ReportType {
  name: string;
  code: string;
}
