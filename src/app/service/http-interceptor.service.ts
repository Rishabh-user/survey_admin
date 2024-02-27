import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private loaderService: LoaderService, private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    const isLoginPage = this.router.url.includes('/login');

    if (token && !isLoginPage) {
      request = request.clone({
        setHeaders: {
          'X-XSRF-TOKEN': `${token}`,
        }
      });
    }

    // Show loader before the request is made
    this.loaderService.show();

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !isLoginPage) {
          alert("Session expired.");
          this.authService.logout();
        } else if (err.status === 500) {
          console.error('Internal Server Error:', err);
        }
        return throwError(() => err);
      }),
      // Hide loader after the request is completed
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}
