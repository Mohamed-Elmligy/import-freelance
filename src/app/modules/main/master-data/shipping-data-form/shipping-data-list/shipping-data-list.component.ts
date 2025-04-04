import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ShippingDataService } from '../shipping-data.service';

import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './shipping-data-list.component.html',
  styles: ``,
})
export default class ShippingDataListComponent {
  languageService = inject(LanguagesService);
  private shippingDataService = inject(ShippingDataService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = [];
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading: boolean = true;

  constructor() {
    effect(() => {
      this.shippingDataService.shippingDataDeleted();
      this.getShippingList();
      this.shippingDataService.shippingDataDeleted.set(false);
    });
  }

  getShippingList(page: number = 1, size: number = 10) {
    this.isLoading = true;
    this.shippingDataService.getList(page, size).subscribe((data: any) => {
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
