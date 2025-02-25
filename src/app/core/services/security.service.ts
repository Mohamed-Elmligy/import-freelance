// angular modules
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { BrowserStorageService } from './browser-storage.service';
import { AUTH_API } from '../apis/auth.api';
import { UserLoginResponseDto } from '../interfaces/auth.interfaces';

@Injectable()
export class SecurityService {
  readonly localKey = 'l_i';
  private accessTokenInterval: any;

  get jwtToken() {
    return this.retrieveToken('access');
  }

  get user() {
    return this.retrieveUser();
  }

  private newAccessTokenJob() {
    this.accessTokenInterval = setInterval(() => {
      this.newAccessToken();
    }, 1200000); // ~20 mins
  }

  private newAccessToken() {
    const refreshToken = this.retrieveToken('refresh');
    this.API.sendDataToServer<any>(AUTH_API.REFRESH_TOKEN, {
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
    if (this.browserStorageService.getData('local', 'l_i') != null) {
      this.API.sendDataToServer(AUTH_API.BLACKLIST_TOKEN, {}).subscribe(() => {
        this.browserStorageService.removeData('local', this.localKey);
      });
    }
  }

  // #region constructor

  constructor(
    private readonly router: Router,
    private API: ApiService,
    private browserStorageService: BrowserStorageService
  ) {}

  // #endregion

  // #region actions

  login(response: any) {
    this.browserStorageService.setData('local', this.localKey, response);
    this.router.navigate(['/pages/dashboard']);
  }

  verify(response: any) {
    this.browserStorageService.setData('local', 'l_i', response);
    this.router.navigate(['verify-user']);
  }

  logout() {
    this.browserStorageService.clearData('local');
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
    const user = this.browserStorageService.getData('local', this.localKey);
    return user && typeof user !== 'undefined'
      ? (user as UserLoginResponseDto)[type]
      : null;
  }

  retrieveUser() {
    const user = this.browserStorageService.getData('local', this.localKey);
    return user && typeof user !== 'undefined'
      ? (user as UserLoginResponseDto)
      : null;
  }

  // #endregion
}
