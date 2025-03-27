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

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, userData);
  }
  
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, userData).pipe(
      tap((response: any) => {
        if (response.token && response.user) { 
          sessionStorage.setItem('token', response.token);
        }
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  validateUserPin(pin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/validateUserPin`, {pin}, { headers: this.getAuthHeaders() });
  }
}