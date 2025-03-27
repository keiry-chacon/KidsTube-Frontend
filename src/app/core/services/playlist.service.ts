import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
 
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  createPlaylist(playlistData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/playlist`, playlistData, { headers: this.getAuthHeaders() });
  }

  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists`, { headers: this.getAuthHeaders() });
  }

  getPlaylistById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlist/${id}`, { headers: this.getAuthHeaders() });
  }

  updatePlaylist(id: string, playlistData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/playlist/${id}`, playlistData, { headers: this.getAuthHeaders() });
  }

  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/playlist/${id}`, { headers: this.getAuthHeaders() });
  }
  getPlaylistsByProfileId(profileId: string): Observable<any> {
    const url = `${this.apiUrl}/playlist/profile/${profileId}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  getRecommendedVideos(): Observable<any> {
    const url = `${this.apiUrl}/videos/recommended`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }
}