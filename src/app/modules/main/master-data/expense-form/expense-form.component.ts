import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { main_routes_paths } from '../../main.routes';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaModule } from 'primeng/textarea';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-expense-form',
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePicker,
    BreadcrumbModule,
    RouterModule,
    CommonModule,
    TextareaModule,
    TranslateModule,
    ButtonGroupModule,
    ButtonModule,
  ],
  templateUrl: './expense-form.component.html',
})
export default class ExpenseFormComponent {
  mainPaths = main_routes_paths;
  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-dollar',
        route: this.mainPaths.data,
        queryParams: { type: 'expenses' },
      },
      { label: 'expenses', route: this.mainPaths.expenses },
    ];
  }
}
