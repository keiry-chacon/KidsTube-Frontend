import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  // Retrieves all profiles with authentication headers
  getProfiles(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${environment.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }
  getProfilesGraph(): Observable<any> {
    const query = `
    query GetProfiles{
      profiles {
        id
        fullName
        avatar
      }
    }
  `;
  
    const requestBody = {
      query,
    };
  
    return this.http.post<any>(`${environment.apiUrl2}`, requestBody, { headers: this.getAuthHeaders() }).pipe(
      map((response) => response.data.profiles) 
    );
  }

  // Retrieves profiles and maps the response to extract the data array
  getProfilesPlaylist(): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${environment.apiUrl}/profile`).pipe(
      map(response => response.data)
    );
  }

  // Retrieves the authentication token from session storage
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }
  // Retrieves the current profile ID from local storage
  getProfileId(): string | null {
    return localStorage.getItem('currentProfileId');
  }

  // Generates authorization headers for authenticated requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Sends a PUT request to update a profile by its ID
  updateProfile(profile: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/profile/${profile._id}`, profile, { headers: this.getAuthHeaders() });
  }

  // Sends a POST request to create a new profile
  createProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/profile`, profile, { headers: this.getAuthHeaders() });
  }

  // Sends a DELETE request to delete a profile by its ID
  deleteProfile(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve a profile by its ID
  getProfileById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() });
  }

  // Validates a profile's PIN by sending a POST request
  validatePin(profileId: string, pin: string): Observable<any> {
    const url = `${environment.apiUrl}/profile/validatePin/${profileId}`;
    return this.http.post(url, { pin }, { headers: this.getAuthHeaders() });
  }
}