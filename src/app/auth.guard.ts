import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Redirect logged-in users away from login or register page
      this.router.navigate(['/profile']);
      return true; // Prevent accessing protected route like login/register
    } else {
      return true; // Allow access if not logged in
    }
  }
}

