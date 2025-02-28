import { CanActivateFn } from "@angular/router";

export const authorizationGuard: CanActivateFn = (route, state) => {
  // TODO: Implement authorization guard logic here after implementing the permissions service.
  return true;
};
