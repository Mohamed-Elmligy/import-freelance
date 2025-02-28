import { CanMatchFn, UrlSegment, Route, Router } from "@angular/router";
import { inject } from "@angular/core";

import { AUTH_PATHS } from "src/app/modules/auth/auth.routes";
import { mainRoutesPaths } from "src/app/modules/main/main.routes";

import { BrowserStorageService } from "../services/browser-storage.service";

export const authModuleGuard: CanMatchFn = () => {
  const browserStorageService = inject(BrowserStorageService);
  const router = inject(Router);

  let activeUser = browserStorageService.get("local", "USER");

  if (activeUser) return router.navigate([mainRoutesPaths.DASHBOARD]);
  return true;
};

// NOTE: Funtion parameters may be used in future use cases..
export const mainModuleGuard: CanMatchFn = (
  route: Route,
  url: UrlSegment[]
) => {
  const browserStorageService = inject(BrowserStorageService);
  const router = inject(Router);

  let activeUser = browserStorageService.get("local", "USER");

  if (activeUser) return true;

  return router.navigate([AUTH_PATHS.LOGIN]);
};
