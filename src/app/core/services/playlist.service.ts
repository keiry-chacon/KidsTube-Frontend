import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createPlaylist(playlistData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/playlist`, playlistData);
  }

  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists`);
  }

  getPlaylistById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlist/${id}`);
  }

  updatePlaylist(id: string, playlistData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/playlist/${id}`, playlistData);
  }

  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/playlist/${id}`);
  }
}