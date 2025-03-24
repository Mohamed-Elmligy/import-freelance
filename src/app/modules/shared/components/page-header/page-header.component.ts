import { Location, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'page-header',
  imports: [TranslatePipe, NgClass, ButtonModule, BreadcrumbModule, RouterLink],
  template: `
    <div class="flex items-center justify-between px-3 mb-4">
      <h1 class="font-semibold text-3xl">
        {{ title() | translate }}
      </h1>

      @if(withBreadCrumb()) {

      <p-breadcrumb [model]="route()">
        <ng-template #item let-item>
          @if(item.route){
            
          <a
            [routerLink]="item.route"
            class="p-breadcrumb-item-link"
            [queryParams]="item.queryParams"
          >
            <span [ngClass]="[item.icon ? item.icon : '', 'text-color']">
            </span>
            <span class="text-dark">{{ item.label | translate }}</span>
          </a>

          }@else {

          <a [href]="item.url">
            <span class="text-color">{{ item.label | translate }}</span>
          </a>

          }
        </ng-template>
      </p-breadcrumb>

      } @else {

      <p-button
        styleClass="!text-primary"
        [label]="'back' | translate"
        variant="outlined"
        (onClick)="goBack()"
      />

      }
    </div>
  `,
})
export class PageHeaderComponent {
  protected location = inject(Location);

  title = input.required<string>();
  withBreadCrumb = input.required<boolean>();
  route = input<MenuItem[]>();

  goBack() {
    this.location.back();
  }
}
