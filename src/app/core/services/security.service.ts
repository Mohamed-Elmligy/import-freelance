import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_AUTH } from '../../modules/auth/auth.api';
import { BrowserStorageService } from './browser-storage.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  readonly localKey = 'jwtToken';
  private accessTokenInterval: any;

  router = inject(Router);
  API = inject(ApiService);
  browserStorageService = inject(BrowserStorageService);

  get jwtToken() {
    return this.retrieveToken('access');
  }

  get userType() {
    return this.retrieveUserType();
  }

  get userFullName() {
    return this.retrieveFullName();
  }

  private newAccessTokenJob() {
    this.accessTokenInterval = setInterval(() => {
      this.newAccessToken();
    }, 1200000); // ~20 mins
  }

  private newAccessToken() {
    const refreshToken = this.retrieveToken('refresh');
    this.API.sendDataToServer(API_AUTH.REFRESH_TOKEN, {
      refresh: refreshToken,
    }).subscribe(
      (response: any) => {
        this.browserStorageService.updateAccessToken(this.localKey, response);
      },
      () => {
        this.logout();
      }
    );
  }

  blackListToken() {
    if (this.browserStorageService.get('local', this.localKey) != null) {
      this.API.sendDataToServer(API_AUTH.BLACKLIST_TOKEN, {}).subscribe(() => {
        this.browserStorageService.remove('local', this.localKey);
      });
    }
  }

  // #region actions

  logout() {
    this.browserStorageService.clear('local');
    this.stopTokenInterval();
    this.router.navigate(['/auth/login']);
    this.blackListToken();
  }

  getAccessToken() {
    this.stopTokenInterval();
    this.newAccessToken();
    this.newAccessTokenJob();
  }

  stopTokenInterval() {
    clearInterval(this.accessTokenInterval);
  }

  // #endregion

  // #region retrieve local storage actions

  retrieveToken(type: string) {
    const access = this.browserStorageService.get(
      'local',
      this.localKey
    ).access;
    return access;
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

  // #endregion
}
