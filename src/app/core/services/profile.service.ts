import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

 
  getProfiles(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  updateProfile(profile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/${profile._id}`, profile,  { headers: this.getAuthHeaders() });
  }
  addProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profile`, profile, { headers: this.getAuthHeaders() });
  }
  deleteProfile(id: string): Observable<any> {
    console.log(`Eliminando perfil con ID: ${id}`); 

    return this.http.delete<any>(`${this.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() } );
  }
}
