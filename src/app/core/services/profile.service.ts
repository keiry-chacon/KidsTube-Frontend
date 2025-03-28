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

  // Retrieves all profiles with authentication headers
  getProfiles(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  // Retrieves profiles and maps the response to extract the data array
  getProfilesPlaylist(): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/profile`).pipe(
      map(response => response.data)
    );
  }

  // Retrieves the authentication token from session storage
  getToken(): string | null {
    return sessionStorage.getItem('token');
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
    return this.http.put<any>(`${this.apiUrl}/profile/${profile._id}`, profile, { headers: this.getAuthHeaders() });
  }

  // Sends a POST request to create a new profile
  createProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profile`, profile, { headers: this.getAuthHeaders() });
  }

  // Sends a DELETE request to delete a profile by its ID
  deleteProfile(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve a profile by its ID
  getProfileById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() });
  }

  // Validates a profile's PIN by sending a POST request
  validatePin(profileId: string, pin: string): Observable<any> {
    const url = `${this.apiUrl}/profile/validatePin/${profileId}`;
    return this.http.post(url, { pin }, { headers: this.getAuthHeaders() });
  }
}