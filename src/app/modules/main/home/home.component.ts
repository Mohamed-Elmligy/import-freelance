import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SecurityService } from '../../../core/services/security.service';
import { ApiService } from '../../../core/services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { LanguagesService } from '../../shared/services/languages.service';
import { UserPermissionService } from '../../../services/user-permission.service';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, SkeletonModule],
  templateUrl: './home.component.html',
})
export default class HomeComponent implements OnInit {
  public securityService = inject(SecurityService);
  private httpService = inject(ApiService);
  languageService = inject(LanguagesService);
  // userPermissionService = inject(UserPermissionService);

  totals: HomeTotals = {} as HomeTotals;
  icons: string[] = ['description', 'person', 'store', 'local_shipping']; // Add icons array
  totalsKeys: string[] = [
    'total_invoices',
    'total_customers',
    'total_suppliers',
    'total_shipments',
  ]; // Add keys array
  labels: string[] = ['Invoices', 'Customers', 'Suppliers', 'Shipment']; // Add labels array
  isLoading = true; // Add isLoading property

  ngOnInit(): void {
    this.languageService.initLanguage();
    this.languageService.getDefaultLanguage();
    this.httpService.getDataFromServer('home').subscribe({
      next: (response: HomeTotals) => {
        this.isLoading = true; // Set loading to true

        this.totals = response;
        this.isLoading = false; // Set loading to false
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
