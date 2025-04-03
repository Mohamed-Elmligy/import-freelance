import { Component, effect, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule, Toolbar } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table'; // Added PrimeNG Table module
import { Tag } from 'primeng/tag';
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { FiscalYearService } from '../fiscal-year.service';

@Component({
  selector: 'app-fiscal-year-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    Toolbar,
    DatePickerModule,
    TooltipModule,
    TableModule, // Added PrimeNG Table module
  ],
  templateUrl: './fiscal-year-list.component.html',
  styles: ``,
})
export default class FiscalYearListComponent {
  languageService = inject(LanguagesService);
  YearService = inject(FiscalYearService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  dataSource: any[] = []; // Changed to array for PrimeNG table
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  constructor() {
    effect(() => {
      this.YearService.yearDeleted();
      this.getYearList();
      this.YearService.yearDeleted.set(false);
    });
  }

  getYearList(page: number = 1, size: number = 10) {
    this.YearService.getList(page, size).subscribe((data: any) => {
      this.tableColumns = this.YearService.yearHeaders;
      this.displayedColumns = this.YearService.yearHeaders;
      this.dataSource = this.YearService.apiModelToComponentModelList(
        data.results
      );
      this.resultsLength = data.count;
    });
  }

  editYear(yearId: any) {
    this.router.navigate([`/${main_routes_paths.year}`], {
      queryParams: { yearId: yearId, edit: true },
    });
  }
  deleteYear(id: string) {
    this.YearService.deleteYear(id);
  }
  viewYear(yearId: string) {
    this.router.navigate([`/${main_routes_paths.year}`], {
      queryParams: { yearId: yearId, edit: false },
    });
  }
}
