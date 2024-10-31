import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

interface ApiResponse {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  resetEmail: string = '';
  errorMessage: string = '';
  resetMessage: string = '';
  apiUrl = environment.apiUrl;
  showPasswordReset: boolean = false;

  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    const loginData = { email: this.email, password: this.password };
  
    this.authService.login(loginData).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          this.toasterService.success('Login successful!');
          this.router.navigate(['/projects-list']);
        } else {
          this.toasterService.error('Login failed. No token received.');
        }
      },
      error => {
        console.error('Login error:', error);
        this.toasterService.error('Login failed. Please try again.');
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordReset(): void {
    this.showPasswordReset = !this.showPasswordReset;
    this.resetMessage = ''; 
    this.cdr.detectChanges(); 
  }
  

  requestPasswordReset(): void {
    if (!this.resetEmail) {
      this.toasterService.error('Please enter your email address.');
      return;
    }
  
    const resetData = { email: this.resetEmail };
    
    this.authService.requestPasswordReset(resetData).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          this.resetMessage = 'Password reset link has been sent to your email!';
          this.toasterService.success(this.resetMessage);
        } else {
          this.resetMessage = response.message || 'Error sending reset link.';
          this.toasterService.error(this.resetMessage);
        }
      },
      error => {
        console.error('Password reset error:', error);
        this.toasterService.error('Failed to send password reset link. Please try again.');
      }
    );
  }
}
