import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  listOfCustomers = signal([]);
  listOfSuppliers = signal([]);
  listOfInvoices = signal([]);
}
