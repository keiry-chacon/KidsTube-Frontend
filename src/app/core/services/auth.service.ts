import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Sends a POST request to register a new user
  signup(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/video`, userData);
  }
}