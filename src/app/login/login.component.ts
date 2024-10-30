import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { environment } from 'src/environments/environment';
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
  loginResponse: any;
  showPasswordReset: boolean = false; // Toggle state for password reset

  constructor(private http: HttpClient, private router: Router, private toasterService: ToasterService) {}

  login(): void {
    const loginData = { email: this.email, password: this.password };
  
    this.http.post<any>(`${this.apiUrl}/login`, loginData).subscribe(
      response => {
        if (response.success && response.message.token) {
          this.loginResponse = response;
          this.toasterService.success('Login successful!');
          
          localStorage.setItem('authToken', response.message.token);
          localStorage.setItem('userEmail', this.email);
  
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
    this.showPasswordReset = !this.showPasswordReset; // Toggle the password reset view
    this.resetMessage = ''; // Clear previous reset message
  }

  requestPasswordReset(): void {
    if (!this.resetEmail) {
      this.toasterService.error('Please enter your email address.');
      return;
    }

    const resetData = { email: this.resetEmail };
    
    this.http.post<any>(`${this.apiUrl}/request_password_reset`, resetData).subscribe(
      response => {
        if (response.success) {
          this.resetMessage = 'Password reset link has been sent to your email!';
          this.toasterService.success(this.resetMessage);
        } else {
          this.resetMessage = response.message;
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
