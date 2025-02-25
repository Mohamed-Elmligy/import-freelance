import { Injectable } from '@angular/core';
import * as Crypto from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  private encrypt(val: string): string {
    return Crypto.AES.encrypt(val, environment.browser_storage_key).toString();
  }

  private decrypt(val: string) {
    return Crypto.AES.decrypt(val, environment.browser_storage_key).toString(
      Crypto.enc.Utf8
    );
  }

  updateAccessToken(key: string, value: { access: string; refresh: string }) {
    const data = this.getData('local', key);
    const updated = { ...data, refresh: value.refresh, access: value.access };
    this.setData('local', key, updated);
  }

  setData<T>(storage: 'local' | 'session', key: string, value: T) {
    let stringifiedValue = JSON.stringify(value);
    if (storage === 'local') {
      localStorage.setItem(key, this.encrypt(stringifiedValue));
    } else {
      sessionStorage.setItem(key, this.encrypt(stringifiedValue));
    }
  }

  getData(storage: 'local' | 'session', key: string) {
    let value;
    if (storage === 'local') {
      value = localStorage.getItem(key);
    } else {
      value = sessionStorage.getItem(key);
    }
    return value && JSON.parse(this.decrypt(value));
  }

  removeData(storage: 'local' | 'session', key: string) {
    if (storage === 'local') {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }

  clearData(storage: 'local' | 'session') {
    if (storage === 'local') {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
  }
}
