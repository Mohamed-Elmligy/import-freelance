import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ListTableService {
  apiService = inject(ApiService);
  constructor() {}

  getList(type: string) {
    return this.apiService.getDataFromServer(`${type}/list`);
  }
}
