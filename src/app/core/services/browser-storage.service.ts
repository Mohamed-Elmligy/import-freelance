import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  private cryptoJs: any;

  constructor() {
    this.loadCryptoJs();
  }

  private async loadCryptoJs() {
    this.cryptoJs = await import('crypto-js');
  }

  private encrypt(value: string): string {
    if (!this.cryptoJs) {
      throw new Error('crypto-js module not loaded');
    }
    return this.cryptoJs.AES.encrypt(
      value,
      environment.encryptionKey
    ).toString();
  }

  private decrypt(value: string) {
    if (!this.cryptoJs) {
      throw new Error('crypto-js module not loaded');
    }
    const bytes = this.cryptoJs.AES.decrypt(value, environment.encryptionKey);
    return bytes.toString(this.cryptoJs.enc.Utf8);
  }

  set<T>(storage: 'local' | 'session', key: string, value: T) {
    let stringifiedValue = JSON.stringify(value);
    if (storage === 'local') {
      localStorage.setItem(key, this.encrypt(stringifiedValue));
    } else {
      sessionStorage.setItem(key, this.encrypt(stringifiedValue));
    }
  }

  get(storage: 'local' | 'session', key: string) {
    let value;
    if (storage === 'local') {
      value = localStorage.getItem(key);
    } else {
      value = sessionStorage.getItem(key);
    }
    return value && JSON.parse(this.decrypt(value));
  }

  remove(storage: 'local' | 'session', key: string) {
    if (storage === 'local') {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }

  clear(storage: 'local' | 'session') {
    if (storage === 'local') {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
  }

  updateAccessToken(key: string, value: { access: string; refresh: string }) {
    const data = this.get('local', key);
    const updated = { ...data, refresh: value.refresh, access: value.access };
    this.set('local', key, updated);
  }
}
