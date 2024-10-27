import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    console.log('Token from localStorage:', token); // Debugging log

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Correctly setting the header
        }
      });
      console.log('Cloned request headers:', cloned.headers); // Check the headers here
      return next.handle(cloned); // Pass the cloned request
    }

    return next.handle(req); // Pass the original request if no token
  }
}
