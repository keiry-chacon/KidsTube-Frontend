import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Logs out the user by removing the authentication token from session storage
  logout() {
    sessionStorage.removeItem('token');
  }

  // Sends a POST request to register a new user
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, userData);
  }

  // Sends a POST request to log in a user and stores the token in session storage
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, userData).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          sessionStorage.setItem('token', response.token);
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

  // Validates the user's PIN by sending a POST request
  validateUserPin(pin: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/user/validateUserPin`,
      { pin },
      { headers: this.getAuthHeaders() }
    );
  }
}