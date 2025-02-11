import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './auth-layout.component.html',
})
export default class AuthLayoutComponent {}
