import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number; // Expiration time (in seconds since epoch)
  role: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$: Observable<boolean> = this.authStatusSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.checkTokenOnLoad();
  }

  // Load token and set authentication status on service initialization
  private checkTokenOnLoad(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.authStatusSubject.next(true);
    } else {
      this.logout(); // If expired or missing, log out
    }
  }

  // Retrieve token from local storage
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Decode token to get details
  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check token expiration status
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.exp * 1000 < Date.now() : true;
  }

  // Store token in local storage and update authentication status
  private setToken(token: string, email: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    this.authStatusSubject.next(true);
  }

  // Login user and store token on success
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleLoginResponse(response, credentials.email)),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  // Handle login response and set token if successful
  private handleLoginResponse(response: any, email: string): void {
    if (response?.success) {
      this.setToken(response.message.token, email);
    } else {
      console.warn('Login failed:', response);
    }
  }

  // Log out user by clearing token and updating auth status
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    this.authStatusSubject.next(false);
  }

  // Check if user is currently logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if user has admin role
  isAdmin(): boolean {
    const token = this.getToken();
    const decoded = token ? this.decodeToken(token) : null;
    return decoded?.role === 'admin';
  }

  // Update user profile with form data
  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/profile`, formData).pipe(
      catchError(error => {
        console.error('Error updating profile:', error);
        throw error;
      })
    );
  }

  // Retrieve user profile data based on email
  getUserProfile(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/profile/${email}`).pipe(
      tap(response => this.handleProfileResponse(response)),
      catchError(error => {
        console.error('Error fetching profile:', error);
        throw error;
      })
    );
  }

  // Handle user profile response and log profile data
  private handleProfileResponse(response: any): void {
    if (response?.success) {
      console.log('User profile fetched:', response.data);
    } else {
      console.warn('Failed to fetch profile:', response);
    }
  }

  // Request password reset for a user by email
  requestPasswordReset(emailData: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request_password_reset`, emailData).pipe(
      catchError(error => {
        console.error('Error requesting password reset:', error);
        throw error;
      })
    );
  }

  public getUserInfo(): DecodedToken | null {
    const token = localStorage.getItem('authToken');
    return token ? this.decodeToken(token) : null;
  }
  getUserEmail(): string {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded =  this.decodeToken(token);
      return decoded.email || '';
    }
    return '';
  }
}
