import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Retrieves the authentication token from session storage
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Generates authorization headers for authenticated requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Sends a POST request to create a new playlist
  createPlaylist(playlistData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/playlist`, playlistData, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve all playlists
  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists`, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve a playlist by its ID
  getPlaylistById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlist/${id}`, { headers: this.getAuthHeaders() });
  }

  // Sends a PUT request to update a playlist by its ID
  updatePlaylist(id: string, playlistData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/playlist/${id}`, playlistData, { headers: this.getAuthHeaders() });
  }

  // Sends a DELETE request to delete a playlist by its ID
  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/playlist/${id}`, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve playlists associated with a specific profile ID
  getPlaylistsByProfileId(profileId: string): Observable<any> {
    const url = `${this.apiUrl}/playlist/profile/${profileId}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve recommended videos
  getRecommendedVideos(): Observable<any> {
    const url = `${this.apiUrl}/videos/recommended`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }
}