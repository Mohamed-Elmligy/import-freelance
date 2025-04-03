import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { API_AUTH } from '../../modules/auth/auth.api';
import { BrowserStorageService } from './browser-storage.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  readonly localKey = 'jwtToken';
  router = inject(Router);
  API = inject(ApiService);
  browserStorageService = inject(BrowserStorageService);

  allJwtData = signal(this.retrieveJwtData());

  get jwtToken() {
    return this.retrieveAccess();
  }

  getRefreshToken() {
    return this.retrieveRefreshToken();
  }

  get userType() {
    return this.retrieveUserType();
  }

  get userFullName() {
    return this.retrieveFullName();
  }

  // #region actions

  logout() {
    this.browserStorageService.clearData('local');
    this.router.navigate(['/auth/login']);
  }

  // #endregion

  // #region retrieve local storage actions

  retrieveJwtData() {
    return this.getJwtDataFromStorage();
  }

  retrieveAccess() {
    return this.getJwtDataFromStorage().access;
  }

  retrieveRefreshToken() {
    return this.getJwtDataFromStorage().refresh;
  }

  retrieveUserType() {
    return this.getJwtDataFromStorage().user_type;
  }

  retrieveFullName() {
    return this.getJwtDataFromStorage().full_name;
  }

  retrieveUserCompany() {
    return this.getJwtDataFromStorage().company;
  }

  updateUerCompanyStatus(state: boolean) {
    this.browserStorageService.setData('local', this.localKey, {
      ...this.retrieveJwtData(),
      company: state,
    });
  }

  getNewAccessToken() {
    return this.API.sendDataToServer(API_AUTH.REFRESH_TOKEN, {
      refresh: this.getRefreshToken(),
    });
  }

  removeToken() {
    this.allJwtData.set({
      access: '',
      refresh: '',
    });
  }

  private getJwtDataFromStorage() {
    return this.browserStorageService.getData('local', this.localKey);
  }
}
