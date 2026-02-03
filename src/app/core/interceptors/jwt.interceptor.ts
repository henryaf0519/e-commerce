import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse, // 1. Importamos esto
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // 2. Importamos catchError
import { Router } from '@angular/router'; // 3. Importamos Router

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private protectedRoutes = [
    '/orders/my-orders',
    '/profile',
    '/auth/change-password',
    '/orders/admin/all',
    '/products/admin/all',
    '/products',
    '/sections',
    '/users', // Agregado por si acaso
  ];

  // 4. Inyectamos el Router en el constructor
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    const isProtectedRoute = this.protectedRoutes.some((route) =>
      request.url.includes(route),
    );

    if (token && isProtectedRoute) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // 5. Manejamos la respuesta con un pipe
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes('/auth/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      }),
    );
  }
}
