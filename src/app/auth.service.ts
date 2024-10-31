import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { environment } from 'src/environments/environment'; // Import environment
import { tap } from 'rxjs/operators'; // Import tap operator for observable
import { jwtDecode} from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(false); // Tracks auth state
  public authStatus$: Observable<boolean> = this.authStatusSubject.asObservable();

  private apiUrl = environment.apiUrl; // API URL from environment

  constructor(private http: HttpClient) {
    this.checkTokenOnLoad();
  }

  // Check token presence on service initialization
  checkTokenOnLoad(): void {
    const token = localStorage.getItem('authToken');
    this.authStatusSubject.next(!!token); // Update status based on token presence
  }

  // Method to log in the user and set token
  login(credentials: { email: string; password: string }): Observable<any> {
    const email = credentials.email; // Extract the email from credentials
  
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.setToken(response.message.token, email); // Store the token and update auth status
        }
      })
    );
  }
  

  // Store the token and update authentication status
  private setToken(token: string, email: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    this.authStatusSubject.next(true); // Set auth status to true on login
  }

  // Method to log out the user
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    this.authStatusSubject.next(false); // Set auth status to false on logout
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

    isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role === 'admin';
    }
    return false; // If no token, user is not admin
  }
  // Method to request password reset
  requestPasswordReset(emailData: { email: string }): Observable<any> {
    // Make sure this method expects an object with an email property
    return this.http.post<any>(`${this.apiUrl}/password-reset`, emailData);
  }
}
