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
import { SecurityService } from '../../../../../core/services/security.service';
import { LanguagesService } from '../../../../shared/services/languages.service';
import { main_routes_paths } from '../../../main.routes';
import { ItemsCategoryService } from '../items-category.service';

@Component({
  selector: 'app-items-list',
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
    PanelModule,
    DatePickerModule,
    TooltipModule,
    Toolbar,
  ],
  templateUrl: './items-list.component.html',
  styles: ``,
})
export default class ItemsListComponent {
  languageService = inject(LanguagesService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  ItemsCategoryService = inject(ItemsCategoryService);
  securityService = inject(SecurityService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<any>;

  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  resultsLength = 0;

  constructor() {
    effect(() => {
      this.ItemsCategoryService.itemDeleted();
      this.getItemsList();
      this.ItemsCategoryService.itemDeleted.set(false);
    });
  }

  ngOnInit() {
    this.getItemsList();
  }

  getItemsList() {
    this.ItemsCategoryService.getList().subscribe((data: any) => {
      this.tableColumns = this.ItemsCategoryService.itemsHeaders;
      this.displayedColumns = this.ItemsCategoryService.itemsHeaders;
      let ModifideData = this.ItemsCategoryService.apiModelToComponentModelList(
        data.results
      );
      this.dataSource = new MatTableDataSource<any>(ModifideData);
      this.resultsLength = data.count;
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
