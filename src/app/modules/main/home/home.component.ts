import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SecurityService } from '../../../core/services/security.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-home',
  imports: [TranslateModule],
  templateUrl: './home.component.html',
})
export default class HomeComponent implements OnInit {
  public securityService = inject(SecurityService);
  private httpService = inject(ApiService);

  totals: HomeTotals = {} as HomeTotals;

  ngOnInit(): void {
    this.httpService.getDataFromServer('home').subscribe({
      next: (response: HomeTotals) => {
        this.totals = response;
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
