import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  name: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
  
    const registerData = { email: this.email, password: this.password, name: this.name };
  
    this.http.post<any>('http://54.251.133.142:5001/register', registerData).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Registration successful!';
          this.router.navigate(['/login']);  // Navigate to login page
        } else {
          this.errorMessage = response.message;
        }
        this.clearMessages();
      },
      error => {
        console.error('Registration error:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.clearMessages();
      }
    );
  }
  
  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000); // Clear messages after 5 seconds
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
