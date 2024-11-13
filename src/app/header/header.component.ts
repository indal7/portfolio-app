import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    this.authService.authStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.updateUserInfo();
      } else {
        this.clearUserInfo();
      }
    });
  }

  // Update user information from AuthService
  private updateUserInfo(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.userName = userInfo.name;
      this.userEmail = userInfo.email;
      this.userRole = userInfo.role;
    } else {
      console.warn('No user information available'); // Warning if no user info is present
    }
  }

  // Clear user information when logged out
  private clearUserInfo(): void {
    this.userName = null;
    this.userEmail = null;
    this.userRole = '';
  }

  // Navigate to the login page
  navigateToLogin(event: Event): void {
    event.preventDefault();
    console.error('User not logged in. Redirecting to login page.');
    this.router.navigate(['/login']); // Redirect to the login page
  }

  // Log out the user and navigate to login page
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
