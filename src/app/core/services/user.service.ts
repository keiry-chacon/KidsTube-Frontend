import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Logs out the user by removing the authentication token from session storage
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
  }

  // Sends a POST request to register a new user
  signup(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user`, userData);
  }

  // Sends a POST request to log in a user and stores the token in session storage
  login(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/login`, userData).pipe(
      tap((response: any) => {
        if (response.userId) {
          sessionStorage.setItem('tempUserId', response.userId);
        }
        if (response.userId) {
          sessionStorage.setItem('userId', response.userId); // Guarda el userId
        }
      })
    );
  }  

  // Retrieves the authentication token from session storage
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Generates authorization headers for authenticated requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  verify2FACode(userId: string, code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/verify-2fa`, { userId, code });
  }  

  // Validates the user's PIN by sending a POST request
  validateUserPin(pin: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/user/validateUserPin`,
      { pin },
      { headers: this.getAuthHeaders() }
    );
  }

  // Verify an account using the token
  verifyAccount(token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/verify/${token}`);
  }
}