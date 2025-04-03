import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  isLoading = signal(false);

  show() {
    this.isLoading.set(true);
    console.log('Spinner Service: Loading started');
  }

  hide() {
    this.isLoading.set(false);
    console.log('Spinner Service: Loading finished');
  }
}
