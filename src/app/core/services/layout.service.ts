import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Injectable, inject, signal } from "@angular/core";

import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Direction } from "@angular/cdk/bidi";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  private mediaObserver = inject(BreakpointObserver);

  mobileMenuOpen = signal(false);
  miniMenu = signal(false);

  isLoading = signal<boolean>(false);

  darkMode = signal<boolean>(false);

  /* 
    TODO: remove direction and languge signals, 
    rely on ngx-translate and native lang and dir attributes
  */
  direction = signal<Direction>(DIR.RTL);
  language = signal<LANG>(LANG.AR);

  onMobile = signal<boolean>(false);
  onTablet = signal<boolean>(false);

  constructor() {
    this.mediaObserver
      .observe("(max-width: 40rem)")
      .pipe(takeUntilDestroyed())
      .subscribe((res: BreakpointState) => this.onMobile.set(res.matches));

    this.mediaObserver
      .observe(["(max-width: 64rem)", "(min-width: 40rem)"])
      .pipe(takeUntilDestroyed())
      .subscribe((res: BreakpointState) => {
        this.onTablet.set(
          res.breakpoints["(max-width: 64rem)"] &&
            res.breakpoints["(min-width: 40rem)"]
        );
      });
  }
}

export enum DIR {
  LTR = "ltr",
  RTL = "rtl",
}

export enum LANG {
  AR = "ar",
  EN = "en",
}
