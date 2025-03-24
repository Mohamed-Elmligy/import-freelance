import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {}

  layoutDir(): 'ltr' | 'rtl' {
    // Implement the logic to return 'ltr' or 'rtl'
    return 'ltr'; // or 'rtl' based on your logic
  }
}
