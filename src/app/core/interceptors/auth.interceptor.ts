import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { SecurityService } from "../services/security.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private securityService: SecurityService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token
    if (
      !request.url.startsWith('http') &&
      !request.url.startsWith('https') &&
      !request.url.includes('assets') &&
      this.securityService.jwtToken
    ) {
      const authReq = request.clone({
        headers: request.headers
          .set("Authorization", `Bearer ${this.securityService.jwtToken}`)

      });
      // pass on the cloned request instead of the original request.
      return next.handle(authReq);
    } else {
      return next.handle(request);
    }
  }
}
