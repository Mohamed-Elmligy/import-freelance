import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SecurityService } from '../../../core/services/security.service';
import { ApiService } from '../../../core/services/api.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, SkeletonModule],
  templateUrl: './home.component.html',
})
export default class HomeComponent implements OnInit {
  public securityService = inject(SecurityService);
  private httpService = inject(ApiService);

  totals: HomeTotals = {} as HomeTotals;
  loading: boolean = true; // Add loading state
  icons: string[] = ['description', 'person', 'store', 'local_shipping']; // Add icons array
  totalsKeys: string[] = [
    'total_invoices',
    'total_customers',
    'total_suppliers',
    'total_shipments',
  ]; // Add keys array
  labels: string[] = ['Invoices', 'Customers', 'Suppliers', 'Shipment']; // Add labels array

  ngOnInit(): void {
    this.httpService.getDataFromServer('home').subscribe({
      next: (response: HomeTotals) => {
        this.totals = response;
        this.loading = false; // Set loading to false after data is loaded
      },
    });
  }
}

type HomeTotals = {
  cover_img: string;
  logo_img: string;
  total_invoices: number;
  total_customers: number;
  total_suppliers: number;
  total_shipments: number;
};
