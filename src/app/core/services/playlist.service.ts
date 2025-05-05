import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
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
    return this.http.post(`${environment.apiUrl}/playlist`, playlistData, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve all playlists
  getPlaylists(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/playlists`, { headers: this.getAuthHeaders() });
  }

  // Sends a GET request to retrieve a playlist by its ID
  getPlaylistById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/playlist/${id}`, { headers: this.getAuthHeaders() });
  }

  // Sends a PUT request to update a playlist by its ID
  updatePlaylist(id: string, playlistData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/playlist/${id}`, playlistData, { headers: this.getAuthHeaders() });
  }

  // Sends a DELETE request to delete a playlist by its ID
  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/playlist/${id}`, { headers: this.getAuthHeaders() });
  }
  getUserPlaylists(): Observable<any>  {
    const graphqlQuery = {
      query: `
        query {
          playlistsByUser {
            id
            name
            createdBy
            associatedProfiles {
              id
              fullName
              avatar
            }
            videos {
              id
              url
            }
          }
        }
      `
    };

    return this.http.post(environment.apiUrl2, graphqlQuery, { headers: this.getAuthHeaders() });

  }
  // Sends a GET request to retrieve playlists associated with a specific profile ID
  getPlaylistsByProfileId(profileId: string): Observable<any> {
    const url =  `${environment.apiUrl}/playlist/profile/${profileId}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }


  // Sends a GET request to retrieve recommended videos
  getRecommendedVideos(): Observable<any> {
    const url = `${environment.apiUrl}/videos/recommended`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }
}