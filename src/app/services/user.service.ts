// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Import catchError for error handling
import { environment } from 'src/environments/environment';
import { UserProfile } from '../profile/profile.component'; // Ensure the UserProfile interface is imported

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch user profile by email
  getUserProfile(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${email}`).pipe(
      catchError(error => {
        console.error('Error fetching profile:', error);
        throw error; // Re-throw the error after logging
      })
    );
  }

  // Update user profile
  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profile`, formData).pipe(
      catchError(error => {
        console.error('Error updating profile:', error);
        throw error; // Re-throw the error after logging
      })
    );
  }

  // Fetch all users
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/fetch_all_users`);
  }

  // Update user role
  updateUserRole(userEmail: string, newRole: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/update_user_role`, { role: newRole, email: userEmail });
  }

  // Register a new user
  registerUser(registerData: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, registerData).pipe(
      catchError(error => {
        console.error('Error registering user:', error);
        throw error; // Re-throw the error after logging
      })
    );
  }

  resetPassword(resetData: { newPassword: string; token: string | null }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/reset_password`, resetData).pipe(
      catchError(error => {
        console.error('Error resetting password:', error);
        throw error; // Re-throw the error after logging
      })
    );
  }
}
