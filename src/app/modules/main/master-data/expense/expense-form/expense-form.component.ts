import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { main_routes_paths } from '../../../main.routes';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { LookupsService } from '../../../../shared/services/lookups.service';
import { ExpenseService } from '../expense.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

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
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    PageHeaderComponent,
  ],
  templateUrl: './expense-form.component.html',
})
export default class ExpenseFormComponent {
  mainPaths = main_routes_paths;

  route: MenuItem[] =[];
  listOfCustomers = signal([]);

  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private lookupService = inject(LookupsService);
  private expensesService = inject(ExpenseService);

  isUpdate = this.activatedRoute.snapshot.queryParams['edit'] == 'true';
  expenseId = this.activatedRoute.snapshot.queryParams['expenseId'];

  expenseData: {
    amount: number;
    container_number: number;
    customer: string;
    expense_date: Date;
    description: string;
  } = {
    amount: 0,
    container_number: 0,
    customer: '',
    expense_date: new Date(),
    description: '',
  };

  protected form = this.formBuilder.group({
    name: [null, [Validators.required]],
    containerNumber: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    expenseDate: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  submit(form: FormGroup) {
    if (form.valid) {
      if (!this.isUpdate) this.expensesService.createExpense(form);
      else this.expensesService.updateExpense(form, this.expenseId);
    }
  }

  reset(form: FormGroup) {
    form.reset();
  }

  ngOnInit() {
    this.lookupService.getListOfLookups('customers').subscribe((data: any) => {
      this.listOfCustomers.set(data);
      this.expensesService.listOfCustomers.set(data);
    });
    this.route = [
      {
        icon: 'pi pi-dollar',
        route: this.mainPaths.expensesList,
        queryParams: { type: 'expenses' },
      },
      { label: 'expenses', route: this.mainPaths.expenses },
    ];
    if (this.expenseId && !this.isUpdate) this.getExpenseById();
    if (this.expenseId && this.isUpdate) this.updateExpense();
  }

  getExpenseById() {
    this.expensesService
      .getExpenseById(this.expenseId)
      .subscribe((data: any) => {
        this.expenseData = data;
      });
  }
  updateExpense() {
    if (this.isUpdate) {
      this.expensesService
        .getExpenseByIdForUpdate(this.expenseId)
        .subscribe((data) => {
          this.expensesService.apiModelToComponentModel(this.form, data);
        });
    }
  }
}
