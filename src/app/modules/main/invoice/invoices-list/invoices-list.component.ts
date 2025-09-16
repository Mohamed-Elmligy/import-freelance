import { Component, effect, inject, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table'; // Added PrimeNG TableModule
import { LanguagesService } from '../../../shared/services/languages.service';
import { main_routes_paths } from '../../main.routes';
import { InvoiceService } from '../invoice.service';
import { SkeletonModule } from 'primeng/skeleton';
import { UserPermissionService } from '../../../../services/user-permission.service';
import { PaginationService } from '../../../../core/services/pagination.service';

@Component({
  selector: 'app-invoices-list',
  imports: [
    ButtonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    FloatLabelModule,
    ToolbarModule,
    PanelModule,
    DatePickerModule,
    TooltipModule,
    TableModule, // Added PrimeNG TableModule
    SkeletonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './invoices-list.component.html',
})
export default class InvoicesListComponent {
  languageService = inject(LanguagesService);
  invoiceService = inject(InvoiceService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  public userPermissionService = inject(UserPermissionService);
  private paginationService = inject(PaginationService);

  dataSource: any[] = []; // Changed to a simple array
  main_routes = main_routes_paths;
  displayedColumns: string[] = [];
  tableColumns: string[] = [];
  isLoading = true; // Add isLoading property
  
  // Pagination properties - get from service
  get first(): number { return this.paginationService.getPaginationState().first; }
  get rows(): number { return this.paginationService.getPaginationState().rows; }
  get totalRecords(): number { return this.paginationService.getPaginationState().totalRecords; }
  get page(): number { return this.paginationService.getPaginationState().page; }

  filterForm: FormGroup = this.formBuilder.group({
    customer_name: [''],
    supplier_name: [''],
    invoice_number: [''],
  });

  @ViewChild('fileInput') fileInput!: ElementRef;
  isUploading = false;

  constructor(private messageService: MessageService) {
    // Load initial data
    this.getInvoicesList();
    
    effect(() => {
      this.invoiceService.invoiceDeleted();
      this.getInvoicesList();
      this.invoiceService.invoiceDeleted.set(false);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadInvoice(file);
      // Reset the file input
      this.fileInput.nativeElement.value = '';
    }
  }

  uploadInvoice(file: File) {
    // Check if file is an Excel file
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Only Excel files (.xlsx, .xls) are allowed.'
      });
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);

    this.invoiceService.uploadInvoiceFile(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File processed successfully!',
            life: 5000
          });
          // Refresh the invoices list
          this.getInvoicesList();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isUploading = false;
        
        // Check if there are validation errors in the response
        if (error.error?.errors?.length > 0) {
          // Show a summary message
          this.messageService.add({
            severity: 'warn',
            summary: 'Validation Errors',
            detail: `Found ${error.error.errors.length} issues in the uploaded file. Please review the details below.`,
            life: 10000
          });
          
          // Show each validation error as a separate message
          error.error.errors.forEach((err: {row: string; error: string}) => {
            this.messageService.add({
              severity: 'warn',
              summary: `Row: ${err.row}`,
              detail: err.error,
              life: 10000,
              closable: true
            });
          });
        } else {
          // Handle other types of errors
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to process file.',
            life: 10000
          });
        }
      }
    });
  }

  applayFilter() {
    let filterData = this.filterForm.value;
    //format date to YYYY-MM-DD
    if (filterData.invoiceDate) {
      filterData.invoiceDate = filterData.invoiceDate
        .toISOString()
        .split('T')[0];
    }
    // Reset pagination when filtering
    this.paginationService.resetPagination();
    this.getInvoicesList(this.page, this.rows, filterData);
  }

  onPageChange(event: any) {
    const paginationState = this.paginationService.handlePageChange(event);
    
    // Get current filter data to maintain filters during pagination
    let filterData = this.filterForm.value;
    if (filterData.invoiceDate) {
      filterData.invoiceDate = filterData.invoiceDate
        .toISOString()
        .split('T')[0];
    }
    this.getInvoicesList(paginationState.page, paginationState.rows, filterData);
  }

  getInvoicesList(page: number = 1, size: number = 10, filterData: any = {}) {
    this.isLoading = true; // Set loading to true
    this.invoiceService
      .getList(page, size, filterData)
      .subscribe((data: any) => {
        this.tableColumns = this.invoiceService.invoiceHeaders;
        this.displayedColumns = [...this.invoiceService.invoiceHeaders];
        this.dataSource = this.invoiceService.apiModelToComponentModelList(
          data.results
        );
        // Set total records for pagination using the service
        this.paginationService.setTotalRecords(data.count || 0);
        this.isLoading = false; // Set loading to false after data is fetched
      });
  }

  editInvoice(invoiceId: any) {
    this.router.navigate([`/${main_routes_paths.invoices}`], {
      queryParams: { invoiceId: invoiceId, edit: true },
    });
  }

  deleteInvoice(id: string) {
    this.invoiceService.deleteInvoice(id);
  }

  viewInvoice(invoiceId: string) {
    this.router.navigate([`/${main_routes_paths.invoices}`], {
      queryParams: { invoiceId: invoiceId, edit: false },
    });
  }
}
