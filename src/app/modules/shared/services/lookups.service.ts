import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ShowMessageService } from '../../../core/services/show-message.service';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  private apiService = inject(ApiService);
  private showMessageService = inject(ShowMessageService);
  listOfCUstomers = signal([]);
  listOfExpenses = signal([]);

  getListOfLookups(type: string) {
    return this.apiService.getDataFromServer(`lookup/${type}`);
  }
}
