import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  private apiService = inject(ApiService);
  listOfCUstomers = signal([]);
  listOfExpenses = signal([]);

  getListOfLookups(type: string) {
    return this.apiService.getDataFromServer(`lookup/${type}`);
  }
}
