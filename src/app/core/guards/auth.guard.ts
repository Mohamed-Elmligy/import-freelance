import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { BrowserStorageService } from '../services/browser-storage.service';
import { SecurityService } from '../services/security.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  hasPermission = false;

  constructor(
    private readonly securityService: SecurityService,
    public router: Router,
    // private dialogService: DialogService,
    private browserStorageService: BrowserStorageService
  ) {}

  // activate layout if user have valid token
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.browserStorageService.setData('local', 'l_t', state.url);
    if (!this.securityService.jwtToken) {
      this.securityService.logout();
      return false;
    } else if (
      this.securityService.jwtToken &&
      this.securityService.user!.user_type == 'flour' &&
      (!this.securityService.user!.customer_id ||
        !this.securityService.user!.customer_category)
    ) {
      // this.dialogService.alertMessage(
      //   "يوجد خطأ فى بيانات العميل القادمه من السيرفر يرجى التواصل مع الدعم"
      // );
      this.securityService.logout();
      return false;
    } else {
      return true;
    }
  }
}
