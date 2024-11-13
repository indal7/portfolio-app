// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { UserService } from '../services/user.service'; // Inject UserService

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

  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private userService: UserService // Inject UserService
  ) {}

  register(): void {
    // Clear previous messages before new validation
    this.clearMessages();
  
    // Validate password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.toasterService.error(this.errorMessage);
      return;
    }
  
    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.toasterService.error(this.errorMessage);
      return;
    }
  
    // Prepare registration data
    const registerData = { email: this.email, password: this.password, name: this.name };
  
    // Send registration request through UserService
    this.userService.registerUser(registerData).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Registration successful!';
          this.toasterService.success(this.successMessage);
          this.router.navigate(['/login']);  // Navigate to login page
        } else {
          this.errorMessage = response.message || 'Registration failed. Please try again.';
          this.toasterService.error(this.errorMessage);
        }
      },
      error => {
        console.error('Registration error:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.toasterService.error(this.errorMessage);
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
