import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  name: string;
  email?: string;
  exp?: number;
  role: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  userEmail: string | null = null;
  isLoggedIn: boolean = false;
  userRole: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth status changes
    // localStorage.removeItem('authToken');
    this.authService.authStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.updateUserInfo();
      } else {
        this.clearUserInfo();
      }
    });
  }

  updateUserInfo(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);

      this.userName = decoded.name;
      this.userEmail = decoded.email;
      this.userRole = decoded.role || '';
    } else {
      console.warn('No token found'); // Warning if no token is present
    }
  }

  navigateToLogin(event: Event): void {
    event.preventDefault();
    console.error('User not logged in. Redirecting to login page.');
    this.router.navigate(['/login']); // Redirect to the login page
}

  clearUserInfo(): void {
    this.userName = null;
    this.userEmail = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
