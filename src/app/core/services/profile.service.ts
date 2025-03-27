import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

 
  getProfiles(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  getProfilesPlaylist(): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/profile`).pipe(
      map(response => response.data)
    );
  }
  
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  updateProfile(profile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/${profile._id}`, profile,  { headers: this.getAuthHeaders() });
  }
  createProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profile`, profile, { headers: this.getAuthHeaders() });
  }
  deleteProfile(id: string): Observable<any> {
    console.log(`Eliminando perfil con ID: ${id}`); 
    return this.http.delete<any>(`${this.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() } );
  }
  validatePin(profileId: string, pin: string): Observable<any> {
    const url = `${this.apiUrl}/profile/validatePin/${profileId}`; 
    return this.http.post(url, { pin }, { headers: this.getAuthHeaders() }); 
  }
}
