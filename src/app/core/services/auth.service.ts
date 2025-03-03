import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { fromEvent, map } from 'rxjs';

import { auth_routes_paths } from '../../modules/auth/auth.routes';
import { API_AUTH } from '../../modules/auth/auth.api';
import { ApiService } from './api.service';

// import {
//   Credentials,
//   LoginInfo,
//   ResetPasswordModel,
//   VerifyUserModel,
// } from "./auth.store";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private HTTP = inject(ApiService);
  private router = inject(Router);

  user: any;

  /*
    @section Authentication actions
  */

  loginUser(credentials: any) {
    let backEndModel = {
      username: credentials.userName,
      password: credentials.password,
    };
    return this.HTTP.sendDataToServer<any, any>(
      API_AUTH.LOGIN,
      backEndModel
    ).pipe(map((response) => transformLoginInfoModel(response)));
  }

  forgetPassword(userName: string) {
    return this.HTTP.sendDataToServer(API_AUTH.GET_OTP, { username: userName });
  }

  resetPassword(model: any) {
    return this.HTTP.sendDataToServer(API_AUTH.RESET_PASSWORD, {
      username: model.userName,
      password: model.password,
      password_confirm: model.confirmPassword,
    });
  }

  verifyUser(model: any) {
    return this.HTTP.sendDataToServer(API_AUTH.VERIFY, {
      username: model.userName,
      otp: model.otp,
    });
  }

  blacklistToken() {
    return this.HTTP.sendDataToServer(API_AUTH.BLACKLIST_TOKEN, {});
  }

  refreshToken() {
    return this.HTTP.sendDataToServer<any, any>(API_AUTH.REFRESH_TOKEN, {});
  }

  logoutUser() {
    this.router.navigate([auth_routes_paths.LOGIN]);
    this.blacklistToken();
  }

  checkNewTab() {
    return fromEvent(document, 'visibilitychange').pipe(takeUntilDestroyed());
  }
}

// Authentication Models
const transformLoginInfoModel = (response: any): any => {
  return {
    refresh: response.refresh,
    access: response.access,
    user_type: response.user_type,
    user_type_2: response.user_type_2,
    user_type_2_ar: response.user_type_2_ar,
    password_changed: response.password_changed,
    name: response.name,
    is_superuser: response.is_superuser,
    message: response.message,
    customer_id: response.customer_id,
    customer_category: response.customer_category,
    customer_category_title_ar: response.customer_category_title_ar,
    customer_category_title_en: response.customer_category_title_en,
    customer_branch: response.customer_branch,
  };
};
