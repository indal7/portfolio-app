import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  apiUrl = 'http://54.251.133.142:5001/login'; 
  loginResponse: any;

  constructor(private http: HttpClient, private router: Router, private toasterService: ToasterService) {}

  login(): void {
    const loginData = { email: this.email, password: this.password };
  
    this.http.post<any>(this.apiUrl, loginData).subscribe(
      response => {
        if (response.success && response.message.token) {
          this.loginResponse = response;
          this.toasterService.success('Login successful!');
          
          // Save JWT token in localStorage
          localStorage.setItem('authToken', response.message.token);
          
          // Optionally store the user's email
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
}
