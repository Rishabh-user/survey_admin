import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ModalService } from './modal.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private loaderService: LoaderService, private authService: AuthService, private router: Router, private modalService: ModalService) { }

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

    this.loaderService.show();

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !isLoginPage) {
          //alert("Session expired.");
          this.authService.logout();

        } else if (err.status === 408) {
          console.error('Internal Server Error:', err);
          if (!this.modalService.isModalOpen()) {
            this.modalService.triggerModal(true);
          }
        }
        return throwError(() => err);
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}
