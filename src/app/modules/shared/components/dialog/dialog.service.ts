import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  constructor() {}
}
