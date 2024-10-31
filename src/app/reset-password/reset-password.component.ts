import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmNewPassword: string = '';
  resetErrorMessage: string = '';
  resetSuccessMessage: string = '';
  apiUrl = environment.apiUrl;
  resetToken: string | null = null; // This should be set from the URL or sent via email

  constructor(private http: HttpClient, private router: Router, private toasterService: ToasterService) { }

  ngOnInit() {
    // Get the reset token from the URL (if needed)
    this.resetToken = this.getResetTokenFromUrl();
  }

  getResetTokenFromUrl(): string | null {
    // Extract the reset token from the URL, assuming it's a query parameter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token'); // Adjust as necessary based on your URL structure
  }

  resetPassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.resetErrorMessage = 'Passwords do not match.';
      return;
    }

    const resetData = {
      newPassword: this.newPassword,
      token: this.resetToken // Include the reset token if required by your backend
    };

    this.http.post<any>(`${this.apiUrl}/reset_password`, resetData).subscribe(
      response => {
        if (response.success) {
          this.resetSuccessMessage = 'Your password has been reset successfully!';
          this.toasterService.success(this.resetSuccessMessage);
          this.router.navigate(['/login']); // Redirect to the login page after successful reset
        } else {
          this.resetErrorMessage = response.message;
          this.toasterService.error(this.resetErrorMessage);
        }
      },
      error => {
        console.error('Password reset error:', error);
        this.toasterService.error('Failed to reset password. Please try again.');
      }
    );
  }
}
