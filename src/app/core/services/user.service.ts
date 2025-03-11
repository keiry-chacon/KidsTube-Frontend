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
        if (response.token && response.user) { // Asegúrate de que el backend devuelva el usuario
          localStorage.setItem('token', response.token); // Almacena el token
          localStorage.setItem('user', JSON.stringify(response.user)); // Almacena el usuario
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para agregar el token al encabezado de las solicitudes
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
}