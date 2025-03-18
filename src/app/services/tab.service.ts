import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private readonly storageKey = 'lastActiveTab';

  setLastActiveTab(index: any): void {
    localStorage.setItem(this.storageKey, index);
  }

  getLastActiveTab(): number | null {
    const index = localStorage.getItem(this.storageKey);
    return index !== null ? parseInt(index, 10) : null;
  }
}
