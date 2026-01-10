import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private protectedRoutes = [
    '/orders/my-orders',
    '/profile',
    '/auth/change-password'
  ];

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    
    // Verificamos si la URL de la petición coincide con alguna protegida
    const isProtectedRoute = this.protectedRoutes.some(route => request.url.includes(route));

    if (token && isProtectedRoute) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}