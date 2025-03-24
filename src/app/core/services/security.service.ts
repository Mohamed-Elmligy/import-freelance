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
    this.browserStorageService.clear('local');
    this.router.navigate(['/auth/login']);
  }

  // #endregion

  // #region retrieve local storage actions

  retrieveJwtData() {
    const jwtData = this.browserStorageService.get('local', this.localKey);
    return jwtData;
  }
  retrieveAccess() {
    const access = this.browserStorageService.get(
      'local',
      this.localKey
    ).access;
    return access;
  }

  retrieveRefreshToken() {
    const refresh = this.browserStorageService.get(
      'local',
      this.localKey
    ).refresh;
    return refresh;
  }

  retrieveUserType() {
    const userType = this.browserStorageService.get(
      'local',
      this.localKey
    ).user_type;
    return userType;
  }

  retrieveFullName() {
    const fullName = this.browserStorageService.get(
      'local',
      this.localKey
    ).full_name;
    return fullName;
  }

  retrieveUserCompany() {
    const company = this.browserStorageService.get(
      'local',
      this.localKey
    ).company;
    return company;
  }

  updateUerCompanyStatus(state: boolean) {
    this.browserStorageService.set('local', this.localKey, {
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
}
