import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Sends a POST request to register a new user
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/video`, userData);
  }
}