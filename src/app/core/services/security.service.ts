// angular modules
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BrowserStorageService } from './browser-storage.service';
import { API_AUTH } from '../../modules/auth/auth.api';
import { HttpService } from './http.service';

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
    this.API.create(API_AUTH.REFRESH_TOKEN, {
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
    if (this.browserStorageService.get('local', 'l_i') != null) {
      this.API.create(API_AUTH.BLACKLIST_TOKEN, {}).subscribe(() => {
        this.browserStorageService.remove('local', this.localKey);
      });
    }
  }

  // #region constructor

  constructor(
    private readonly router: Router,
    private API: HttpService,
    private browserStorageService: BrowserStorageService
  ) {}

  // #endregion

  // #region actions

  login(response: any) {
    this.browserStorageService.set('local', this.localKey, response);
    this.router.navigate(['/pages/dashboard']);
  }

  verify(response: any) {
    this.browserStorageService.set('local', 'l_i', response);
    this.router.navigate(['verify-user']);
  }

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
    const user = this.browserStorageService.get('local', this.localKey);
    return user && typeof user !== 'undefined';
  }

  retrieveUser() {
    const user = this.browserStorageService.get('local', this.localKey);
    return user && typeof user !== 'undefined';
  }

  // #endregion
}
